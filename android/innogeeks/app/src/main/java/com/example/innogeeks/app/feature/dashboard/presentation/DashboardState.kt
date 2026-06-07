package com.example.innogeeks.app.feature.dashboard.presentation

import com.example.innogeeks.app.feature.auth.domain.model.User
import com.example.innogeeks.app.feature.dashboard.domain.model.CoordinatorStats
import com.example.innogeeks.app.feature.dashboard.domain.model.CoreTeamStats
import com.example.innogeeks.app.feature.dashboard.domain.model.StudentStats
import com.example.innogeeks.app.feature.events.domain.model.Event

data class DashboardState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val studentStats: StudentStats? = null,
    val coordinatorStats: CoordinatorStats? = null,
    val coreTeamStats: CoreTeamStats? = null,
    val upcomingEvents: List<Event> = emptyList(),
    val error: String? = null
)
