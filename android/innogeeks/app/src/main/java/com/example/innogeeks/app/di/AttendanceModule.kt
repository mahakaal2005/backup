package com.example.innogeeks.app.di

import com.example.innogeeks.app.feature.attendance.data.repository.MockAttendanceRepositoryImpl
import com.example.innogeeks.app.feature.attendance.domain.repository.AttendanceRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class AttendanceModule {
    
    @Binds
    @Singleton
    abstract fun bindAttendanceRepository(
        impl: MockAttendanceRepositoryImpl
    ): AttendanceRepository
}
