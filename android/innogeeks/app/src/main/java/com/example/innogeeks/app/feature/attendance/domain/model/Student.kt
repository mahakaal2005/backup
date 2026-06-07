package com.example.innogeeks.app.feature.attendance.domain.model

/**
 * Student model for attendance tracking.
 * Includes attendance rate for "Most Present" sorting.
 */
data class Student(
    val id: String,
    val name: String,
    val regId: String,
    val domain: String,
    val year: Int,
    val attendanceRate: Float = 0f  // 0.0-1.0, for sorting
)
