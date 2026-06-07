package com.example.innogeeks.app.di

import com.example.innogeeks.app.feature.dashboard.data.repository.MockDashboardRepositoryImpl
import com.example.innogeeks.app.feature.dashboard.domain.repository.DashboardRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class DashboardModule {
    
    @Binds
    @Singleton
    abstract fun bindDashboardRepository(
        impl: MockDashboardRepositoryImpl
    ): DashboardRepository
}
