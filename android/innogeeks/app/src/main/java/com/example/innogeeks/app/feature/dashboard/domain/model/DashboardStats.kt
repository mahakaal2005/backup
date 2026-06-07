package com.example.innogeeks.app.feature.dashboard.domain.model

/**
 * Stats for Student/Member dashboard view
 */
data class StudentStats(
    val attendancePercent: Float,  // 0.0f - 1.0f
    val domain: String,
    val totalClasses: Int,
    val attendedClasses: Int
)

/**
 * Stats for Coordinator dashboard view
 */
data class CoordinatorStats(
    val studentsInDomain: Int,
    val totalClasses: Int,
    val lastClassTopic: String?
)

/**
 * Stats for Core Team dashboard view
 */
data class CoreTeamStats(
    val totalMembers: Int,
    val firstYearAttendance: Float,  // 0.0f - 1.0f
    val secondYearAttendance: Float
)
