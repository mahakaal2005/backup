package com.example.innogeeks.app.feature.events.data.repository

import com.example.innogeeks.app.feature.events.domain.model.Event
import com.example.innogeeks.app.feature.events.domain.repository.EventRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.util.Calendar
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Mock implementation of EventRepository.
 */
@Singleton
class MockEventRepositoryImpl @Inject constructor() : EventRepository {
    
    private val mockEvents = mutableListOf(
        Event(
            id = "1",
            title = "Intro to Jetpack Compose",
            description = "Learn the basics of Compose UI",
            room = "Room 304",
            domain = "Android",
            scheduledDate = getTodayAt(14, 0),  // Today at 2 PM
            durationMinutes = 90,
            createdBy = "coord_1"
        ),
        Event(
            id = "2",
            title = "React Hooks Deep Dive",
            room = "Lab 201",
            domain = "Web",
            scheduledDate = getTomorrowAt(10, 0),
            durationMinutes = 60,
            createdBy = "coord_2"
        ),
        Event(
            id = "3",
            title = "Neural Networks Basics",
            room = "Lab 105",
            domain = "ML",
            scheduledDate = getTodayAt(16, 0),  // Today at 4 PM
            durationMinutes = 120,
            createdBy = "coord_3"
        )
    )
    
    override fun getAllEvents(): Flow<List<Event>> = flow {
        delay(300)
        emit(mockEvents.toList())
    }
    
    override fun getEventsForDomain(domain: String): Flow<List<Event>> = flow {
        delay(300)
        emit(mockEvents.filter { it.domain == domain })
    }
    
    override fun getTodaysEventForDomain(domain: String): Flow<Event?> = flow {
        delay(200)
        val today = Calendar.getInstance()
        val startOfDay = today.apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
        }.timeInMillis
        val endOfDay = startOfDay + 24 * 60 * 60 * 1000
        
        val todaysEvent = mockEvents.find { 
            it.domain == domain && 
            it.scheduledDate in startOfDay..endOfDay &&
            !it.isCompleted
        }
        emit(todaysEvent)
    }
    
    override fun getUpcomingEvents(): Flow<List<Event>> = flow {
        delay(300)
        val now = System.currentTimeMillis()
        emit(mockEvents.filter { it.scheduledDate > now && !it.isCompleted })
    }
    
    override suspend fun createEvent(event: Event): Result<Event> {
        delay(500)
        mockEvents.add(event)
        return Result.success(event)
    }
    
    override suspend fun markEventCompleted(eventId: String): Result<Unit> {
        delay(300)
        val index = mockEvents.indexOfFirst { it.id == eventId }
        if (index >= 0) {
            mockEvents[index] = mockEvents[index].copy(isCompleted = true)
            return Result.success(Unit)
        }
        return Result.failure(Exception("Event not found"))
    }
    
    private fun getTodayAt(hour: Int, minute: Int): Long {
        return Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }
    
    private fun getTomorrowAt(hour: Int, minute: Int): Long {
        return Calendar.getInstance().apply {
            add(Calendar.DAY_OF_YEAR, 1)
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }
}
