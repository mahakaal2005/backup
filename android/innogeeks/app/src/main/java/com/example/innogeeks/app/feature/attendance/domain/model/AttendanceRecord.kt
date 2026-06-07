package com.example.innogeeks.app.feature.attendance.domain.model

/**
 * Record of attendance for a specific event.
 */
data class AttendanceRecord(
    val id: String,
    val eventId: String,
    val eventTitle: String,
    val domain: String,
    val date: Long,
    val presentStudentIds: List<String>,
    val totalStudents: Int
)
