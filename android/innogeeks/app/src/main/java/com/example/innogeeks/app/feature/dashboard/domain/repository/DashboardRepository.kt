package com.example.innogeeks.app.feature.dashboard.domain.repository

import com.example.innogeeks.app.feature.dashboard.domain.model.CoordinatorStats
import com.example.innogeeks.app.feature.dashboard.domain.model.CoreTeamStats
import com.example.innogeeks.app.feature.dashboard.domain.model.StudentStats
import com.example.innogeeks.app.feature.events.domain.model.Event
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for dashboard data.
 * Defined in domain layer - implementation in data layer.
 */
interface DashboardRepository {
    
    fun getStudentStats(userId: String): Flow<StudentStats>
    
    fun getCoordinatorStats(domain: String): Flow<CoordinatorStats>
    
    fun getCoreTeamStats(): Flow<CoreTeamStats>
    
    fun getUpcomingEvents(): Flow<List<Event>>
}
