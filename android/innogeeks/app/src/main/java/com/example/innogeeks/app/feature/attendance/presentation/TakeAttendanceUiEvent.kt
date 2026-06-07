package com.example.innogeeks.app.feature.attendance.presentation

sealed interface TakeAttendanceUiEvent {
    data object NavigateBack : TakeAttendanceUiEvent
    data class ShowSnackbar(val message: String) : TakeAttendanceUiEvent
}
