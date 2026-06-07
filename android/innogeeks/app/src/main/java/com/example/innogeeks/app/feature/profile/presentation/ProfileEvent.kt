package com.example.innogeeks.app.feature.profile.presentation

sealed interface ProfileEvent {
    data object OnLogout : ProfileEvent
    data object OnDeleteAccountClicked : ProfileEvent
    data object OnConfirmDelete : ProfileEvent
    data object OnDismissDeleteDialog : ProfileEvent
}
