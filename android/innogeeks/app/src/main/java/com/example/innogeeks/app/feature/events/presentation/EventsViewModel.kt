package com.example.innogeeks.app.feature.events.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import com.example.innogeeks.app.feature.events.domain.repository.EventRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class EventsViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val eventRepository: EventRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(EventsState())
    val state = _state.asStateFlow()
    
    init {
        loadUserRole()
    }
    
    private fun loadUserRole() {
        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            val role = user?.role ?: UserRole.GUEST
            val isGuest = role == UserRole.GUEST
            val canCreate = role in listOf(UserRole.COORDINATOR, UserRole.CORE_TEAM)
            
            _state.update { 
                it.copy(
                    userRole = role,
                    isGuest = isGuest,
                    canCreateEvent = canCreate
                ) 
            }
            
            if (!isGuest) {
                loadEvents()
            } else {
                _state.update { it.copy(isLoading = false) }
            }
        }
    }
    
    private fun loadEvents() {
        viewModelScope.launch {
            eventRepository.getAllEvents().collectLatest { events ->
                _state.update { it.copy(events = events, isLoading = false) }
            }
        }
    }
    
    fun onEvent(event: EventsEvent) {
        when (event) {
            is EventsEvent.OnDomainFilterSelected -> updateFilter(event.domain)
            is EventsEvent.OnEventClicked -> { /* Navigate to detail */ }
        }
    }
    
    private fun updateFilter(domain: String?) {
        val actualDomain = if (domain == "All") null else domain
        _state.update { it.copy(selectedDomainFilter = actualDomain) }
        viewModelScope.launch {
            if (actualDomain == null) {
                eventRepository.getAllEvents().collectLatest { events ->
                    _state.update { it.copy(events = events) }
                }
            } else {
                eventRepository.getEventsForDomain(actualDomain).collectLatest { events ->
                    _state.update { it.copy(events = events) }
                }
            }
        }
    }
}
