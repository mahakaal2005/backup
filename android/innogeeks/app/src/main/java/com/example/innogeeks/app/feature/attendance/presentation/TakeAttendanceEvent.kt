package com.example.innogeeks.app.feature.attendance.presentation

import com.example.innogeeks.app.feature.events.domain.model.Event

sealed interface TakeAttendanceEvent {
    data class OnEventSelected(val event: Event) : TakeAttendanceEvent
    data class OnToggleStudent(val studentId: String) : TakeAttendanceEvent
    data object OnSaveAttendance : TakeAttendanceEvent
    data object OnDismissError : TakeAttendanceEvent
}
