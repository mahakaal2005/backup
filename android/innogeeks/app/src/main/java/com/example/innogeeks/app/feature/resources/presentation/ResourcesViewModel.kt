package com.example.innogeeks.app.feature.resources.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import com.example.innogeeks.app.feature.resources.domain.repository.ResourceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ResourcesViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val resourceRepository: ResourceRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(ResourcesState())
    val state = _state.asStateFlow()
    
    private val _openUrl = Channel<String>()
    val openUrl = _openUrl.receiveAsFlow()
    
    init {
        loadUserRole()
    }
    
    private fun loadUserRole() {
        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            val role = user?.role ?: UserRole.GUEST
            val isGuest = role == UserRole.GUEST
            val canUpload = role in listOf(UserRole.COORDINATOR, UserRole.CORE_TEAM)
            
            _state.update { 
                it.copy(
                    userRole = role,
                    isGuest = isGuest,
                    canUpload = canUpload
                ) 
            }
            
            // Only load resources if not guest
            if (!isGuest) {
                loadResources()
            } else {
                _state.update { it.copy(isLoading = false) }
            }
        }
    }
    
    private fun loadResources() {
        viewModelScope.launch {
            resourceRepository.getAllResources().collectLatest { resources ->
                _state.update { it.copy(resources = resources, isLoading = false) }
            }
        }
    }
    
    fun onEvent(event: ResourcesEvent) {
        when (event) {
            is ResourcesEvent.OnSearchQueryChanged -> updateSearch(event.query)
            is ResourcesEvent.OnDomainFilterSelected -> updateDomainFilter(event.domain)
            is ResourcesEvent.OnResourceClicked -> openResource(event.url)
        }
    }
    
    private fun updateSearch(query: String) {
        _state.update { it.copy(searchQuery = query) }
        viewModelScope.launch {
            if (query.isBlank()) {
                loadResources()
            } else {
                resourceRepository.searchResources(query).collectLatest { results ->
                    _state.update { it.copy(resources = results) }
                }
            }
        }
    }
    
    private fun updateDomainFilter(domain: String?) {
        val actualDomain = if (domain == "All") null else domain
        _state.update { it.copy(selectedDomainFilter = actualDomain) }
        viewModelScope.launch {
            if (actualDomain == null) {
                resourceRepository.getAllResources().collectLatest { resources ->
                    _state.update { it.copy(resources = resources) }
                }
            } else {
                resourceRepository.getResourcesByDomain(actualDomain).collectLatest { resources ->
                    _state.update { it.copy(resources = resources) }
                }
            }
        }
    }
    
    private fun openResource(url: String) {
        viewModelScope.launch {
            _openUrl.send(url)
        }
    }
}
