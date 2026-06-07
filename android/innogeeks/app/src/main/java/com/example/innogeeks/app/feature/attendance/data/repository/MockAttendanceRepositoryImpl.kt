package com.example.innogeeks.app.feature.attendance.data.repository

import com.example.innogeeks.app.feature.attendance.domain.model.AttendanceRecord
import com.example.innogeeks.app.feature.attendance.domain.model.Student
import com.example.innogeeks.app.feature.attendance.domain.repository.AttendanceRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MockAttendanceRepositoryImpl @Inject constructor() : AttendanceRepository {
    
    private val mockStudents = listOf(
        Student("s1", "Aarav Sharma", "2300001", "Android", 1, 0.95f),
        Student("s2", "Priya Patel", "2300002", "Android", 1, 0.88f),
        Student("s3", "Rohan Kumar", "2300003", "Android", 1, 0.82f),
        Student("s4", "Ananya Singh", "2300004", "Android", 1, 0.78f),
        Student("s5", "Vikram Reddy", "2300005", "Android", 1, 0.75f),
        Student("s6", "Sneha Gupta", "2300006", "Android", 1, 0.70f),
        Student("s7", "Arjun Mehta", "2300007", "Android", 1, 0.65f),
        Student("s8", "Kavya Nair", "2300008", "Android", 1, 0.60f),
        Student("s9", "Rahul Joshi", "2200009", "Android", 2, 0.92f),
        Student("s10", "Ishita Verma", "2200010", "Android", 2, 0.85f),
        Student("w1", "Amit Agarwal", "2300011", "Web", 1, 0.90f),
        Student("w2", "Pooja Desai", "2300012", "Web", 1, 0.80f),
        Student("m1", "Sanjay Rao", "2300013", "ML", 1, 0.88f),
        Student("m2", "Divya Iyer", "2300014", "ML", 1, 0.75f)
    )
    
    private val attendanceHistory = mutableListOf<AttendanceRecord>()
    
    override fun getStudentsForDomain(domain: String): Flow<List<Student>> = flow {
        delay(300)
        val students = mockStudents
            .filter { it.domain == domain }
            .sortedByDescending { it.attendanceRate }  // Most Present first!
        emit(students)
    }
    
    override suspend fun saveAttendanceRecord(record: AttendanceRecord): Result<Unit> {
        delay(500)
        attendanceHistory.add(record)
        return Result.success(Unit)
    }
    
    override fun getAttendanceHistory(domain: String): Flow<List<AttendanceRecord>> = flow {
        delay(300)
        emit(attendanceHistory.filter { it.domain == domain })
    }
}
