package com.example.innogeeks.app.feature.profile.presentation

sealed interface ProfileUiEvent {
    data object NavigateToLogin : ProfileUiEvent
    data class ShowSnackbar(val message: String) : ProfileUiEvent
}
