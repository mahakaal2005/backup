package com.example.innogeeks.app.feature.events.domain.model

/**
 * Event/Session model for the club.
 * Used for scheduling classes and linking attendance.
 */
data class Event(
    val id: String,
    val title: String,           // Topic of the session
    val description: String? = null,
    val room: String,
    val domain: String,          // Android, Web, ML, etc.
    val scheduledDate: Long,     // Timestamp
    val durationMinutes: Int = 60,
    val createdBy: String,       // Coordinator ID
    val isCompleted: Boolean = false
)
