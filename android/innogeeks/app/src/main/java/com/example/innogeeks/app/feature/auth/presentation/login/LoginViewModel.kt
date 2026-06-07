package com.example.innogeeks.app.feature.auth.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(LoginState())
    val state = _state.asStateFlow()
    
    private val _uiEvent = Channel<LoginUiEvent>()
    val uiEvent = _uiEvent.receiveAsFlow()
    
    fun onEvent(event: LoginEvent) {
        when (event) {
            is LoginEvent.OnGoogleSignIn -> signInWithGoogle(event.idToken)
            is LoginEvent.OnRegIdChanged -> updateRegId(event.regId)
            is LoginEvent.OnVerifyRegId -> verifyRegId()
            is LoginEvent.OnLoginWithFoundEmail -> proceedToLoginWithHint()
            is LoginEvent.OnContinueAsGuest -> continueAsGuest()
            is LoginEvent.OnDismissError -> dismissError()
            is LoginEvent.OnRetryLogin -> retryLogin()
        }
    }
    
    private fun signInWithGoogle(idToken: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            
            authRepository.signInWithGoogle(idToken)
                .onSuccess { user ->
                    _state.update { it.copy(isLoading = false, user = user) }
                    _uiEvent.send(LoginUiEvent.NavigateToHome)
                }
                .onFailure { exception ->
                    if (exception.message == "EMAIL_MISMATCH") {
                        // Show RegID recovery flow
                        _state.update { 
                            it.copy(
                                isLoading = false, 
                                showRegIdRecovery = true
                            ) 
                        }
                    } else {
                        _state.update { 
                            it.copy(
                                isLoading = false, 
                                error = exception.message ?: "Sign in failed"
                            ) 
                        }
                    }
                }
        }
    }
    
    private fun updateRegId(regId: String) {
        _state.update { it.copy(regIdInput = regId, foundEmail = null) }
    }
    
    private fun verifyRegId() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            
            val regId = _state.value.regIdInput
            authRepository.verifyByRegId(regId)
                .onSuccess { maskedEmail ->
                    if (maskedEmail != null) {
                        // Found - show masked email and enable "Continue to Login"
                        _state.update { 
                            it.copy(
                                isLoading = false,
                                maskedEmailHint = maskedEmail,
                                foundEmail = maskedEmail  // Store to show on login screen
                            )
                        }
                    } else {
                        // Not found - show error
                        _state.update { 
                            it.copy(
                                isLoading = false,
                                error = "Registration ID not found"
                            )
                        }
                    }
                }
                .onFailure { exception ->
                    _state.update { 
                        it.copy(
                            isLoading = false,
                            error = exception.message ?: "Verification failed"
                        )
                    }
                }
        }
    }
    
    private fun proceedToLoginWithHint() {
        // Close bottom sheet, keep the masked email hint to show on login screen
        _state.update { 
            it.copy(
                showRegIdRecovery = false,
                regIdInput = ""
                // Keep maskedEmailHint to display on login screen
            )
        }
    }
    
    private fun continueAsGuest() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            
            authRepository.continueAsGuest()
                .onSuccess { user ->
                    _state.update { it.copy(isLoading = false, user = user) }
                    _uiEvent.send(LoginUiEvent.NavigateToHome)
                }
                .onFailure { exception ->
                    _state.update { 
                        it.copy(
                            isLoading = false,
                            error = exception.message ?: "Failed to continue as guest"
                        )
                    }
                }
        }
    }
    
    private fun dismissError() {
        _state.update { it.copy(error = null) }
    }
    
    private fun retryLogin() {
        _state.update { 
            it.copy(
                showRegIdRecovery = false,
                regIdInput = "",
                maskedEmailHint = null,
                foundEmail = null,
                error = null
            )
        }
    }
}
