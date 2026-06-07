package com.example.innogeeks.app.feature.attendance.presentation

import com.example.innogeeks.app.feature.attendance.domain.model.Student
import com.example.innogeeks.app.feature.events.domain.model.Event

data class TakeAttendanceState(
    val isLoading: Boolean = true,
    val selectedEvent: Event? = null,
    val availableEvents: List<Event> = emptyList(),
    val students: List<StudentAttendanceItem> = emptyList(),
    val isSaving: Boolean = false,
    val error: String? = null
)

data class StudentAttendanceItem(
    val student: Student,
    val isPresent: Boolean = false
)
