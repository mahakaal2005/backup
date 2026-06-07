package com.example.innogeeks.app.feature.auth.presentation.login

import com.example.innogeeks.app.feature.auth.domain.model.User

/**
 * Single source of truth for Login screen state.
 * Follows Philipp Lackner's MVVM pattern.
 */
data class LoginState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val showRegIdRecovery: Boolean = false,
    val regIdInput: String = "",
    val maskedEmailHint: String? = null,
    val foundEmail: String? = null,  // Full email when RegID matches
    val error: String? = null
)
