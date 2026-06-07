package com.example.innogeeks.app.feature.events.domain.repository

import com.example.innogeeks.app.feature.events.domain.model.Event
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for Events.
 */
interface EventRepository {
    
    fun getAllEvents(): Flow<List<Event>>
    
    fun getEventsForDomain(domain: String): Flow<List<Event>>
    
    fun getTodaysEventForDomain(domain: String): Flow<Event?>
    
    fun getUpcomingEvents(): Flow<List<Event>>
    
    suspend fun createEvent(event: Event): Result<Event>
    
    suspend fun markEventCompleted(eventId: String): Result<Unit>
}
