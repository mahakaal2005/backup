package com.example.innogeeks.app.feature.auth.presentation.login

/**
 * One-time UI events (side effects) for Login screen.
 * Follows Philipp Lackner's Channel pattern for navigation/snackbars.
 */
sealed interface LoginUiEvent {
    data object NavigateToHome : LoginUiEvent
    data class ShowSnackbar(val message: String) : LoginUiEvent
}
