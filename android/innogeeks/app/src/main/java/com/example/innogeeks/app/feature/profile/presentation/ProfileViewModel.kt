package com.example.innogeeks.app.feature.profile.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(ProfileState())
    val state = _state.asStateFlow()
    
    private val _uiEvent = Channel<ProfileUiEvent>()
    val uiEvent = _uiEvent.receiveAsFlow()
    
    init {
        loadUser()
    }
    
    private fun loadUser() {
        viewModelScope.launch {
            authRepository.currentUser.collectLatest { user ->
                _state.update { it.copy(user = user, isLoading = false) }
            }
        }
    }
    
    fun onEvent(event: ProfileEvent) {
        when (event) {
            is ProfileEvent.OnLogout -> logout()
            is ProfileEvent.OnDeleteAccountClicked -> showDeleteConfirmation()
            is ProfileEvent.OnConfirmDelete -> deleteAccount()
            is ProfileEvent.OnDismissDeleteDialog -> dismissDeleteDialog()
        }
    }
    
    private fun logout() {
        viewModelScope.launch {
            _state.update { it.copy(isLoggingOut = true) }
            authRepository.signOut()
            _uiEvent.send(ProfileUiEvent.NavigateToLogin)
        }
    }
    
    private fun showDeleteConfirmation() {
        _state.update { it.copy(showDeleteConfirmation = true) }
    }
    
    private fun dismissDeleteDialog() {
        _state.update { it.copy(showDeleteConfirmation = false) }
    }
    
    private fun deleteAccount() {
        viewModelScope.launch {
            _state.update { it.copy(isLoggingOut = true, showDeleteConfirmation = false) }
            // In real app, would delete from Firebase
            authRepository.signOut()
            _uiEvent.send(ProfileUiEvent.ShowSnackbar("Account deleted"))
            _uiEvent.send(ProfileUiEvent.NavigateToLogin)
        }
    }
}
