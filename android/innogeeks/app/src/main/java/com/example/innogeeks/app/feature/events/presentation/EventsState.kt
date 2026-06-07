package com.example.innogeeks.app.feature.events.presentation

import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.events.domain.model.Event

data class EventsState(
    val isLoading: Boolean = true,
    val events: List<Event> = emptyList(),
    val selectedDomainFilter: String? = null,
    val userRole: UserRole? = null,
    val isGuest: Boolean = true,
    val canCreateEvent: Boolean = false,  // Coordinators + Core Team
    val error: String? = null
)

val EVENT_DOMAIN_FILTERS = listOf("All", "Android", "Web", "ML", "IoT", "Blockchain")
