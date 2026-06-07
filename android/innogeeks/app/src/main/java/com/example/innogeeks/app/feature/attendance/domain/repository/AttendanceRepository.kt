package com.example.innogeeks.app.feature.attendance.domain.repository

import com.example.innogeeks.app.feature.attendance.domain.model.AttendanceRecord
import com.example.innogeeks.app.feature.attendance.domain.model.Student
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for Attendance.
 */
interface AttendanceRepository {
    
    /**
     * Get students for a domain, sorted by attendance rate (Most Present first).
     */
    fun getStudentsForDomain(domain: String): Flow<List<Student>>
    
    /**
     * Save attendance record for an event.
     */
    suspend fun saveAttendanceRecord(record: AttendanceRecord): Result<Unit>
    
    /**
     * Get attendance history for a domain.
     */
    fun getAttendanceHistory(domain: String): Flow<List<AttendanceRecord>>
}
