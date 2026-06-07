package com.example.innogeeks.app.feature.dashboard.data.repository

import com.example.innogeeks.app.feature.dashboard.domain.model.CoordinatorStats
import com.example.innogeeks.app.feature.dashboard.domain.model.CoreTeamStats
import com.example.innogeeks.app.feature.dashboard.domain.model.StudentStats
import com.example.innogeeks.app.feature.dashboard.domain.repository.DashboardRepository
import com.example.innogeeks.app.feature.events.domain.model.Event
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.util.Calendar
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Mock implementation of DashboardRepository.
 * Swap with Firebase implementation later.
 */
@Singleton
class MockDashboardRepositoryImpl @Inject constructor() : DashboardRepository {
    
    override fun getStudentStats(userId: String): Flow<StudentStats> = flow {
        delay(500)
        emit(
            StudentStats(
                attendancePercent = 0.85f,
                domain = "Android",
                totalClasses = 20,
                attendedClasses = 17
            )
        )
    }
    
    override fun getCoordinatorStats(domain: String): Flow<CoordinatorStats> = flow {
        delay(500)
        emit(
            CoordinatorStats(
                studentsInDomain = 24,
                totalClasses = 12,
                lastClassTopic = "Jetpack Compose Navigation"
            )
        )
    }
    
    override fun getCoreTeamStats(): Flow<CoreTeamStats> = flow {
        delay(500)
        emit(
            CoreTeamStats(
                totalMembers = 87,
                firstYearAttendance = 0.78f,
                secondYearAttendance = 0.92f
            )
        )
    }
    
    override fun getUpcomingEvents(): Flow<List<Event>> = flow {
        delay(300)
        emit(
            listOf(
                Event(
                    id = "1",
                    title = "Intro to Jetpack Compose",
                    description = "Learn the basics of Compose UI",
                    room = "Room 304",
                    domain = "Android",
                    scheduledDate = getTodayAt(14, 0),
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
                )
            )
        )
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
