package com.example.innogeeks.app.feature.profile.presentation

import com.example.innogeeks.app.feature.auth.domain.model.User

data class ProfileState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val showDeleteConfirmation: Boolean = false,
    val isLoggingOut: Boolean = false,
    val error: String? = null
)
