package com.example.innogeeks.app.feature.auth.presentation.login

/**
 * User actions on the Login screen.
 * Using sealed interface for exhaustive when() checks.
 */
sealed interface LoginEvent {
    data class OnGoogleSignIn(val idToken: String) : LoginEvent
    data class OnRegIdChanged(val regId: String) : LoginEvent
    data object OnVerifyRegId : LoginEvent
    data object OnLoginWithFoundEmail : LoginEvent  // Login with email found via RegID
    data object OnContinueAsGuest : LoginEvent
    data object OnDismissError : LoginEvent
    data object OnRetryLogin : LoginEvent
}
