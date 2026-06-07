package com.example.innogeeks.app.di

import com.example.innogeeks.app.feature.events.data.repository.MockEventRepositoryImpl
import com.example.innogeeks.app.feature.events.domain.repository.EventRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class EventModule {
    
    @Binds
    @Singleton
    abstract fun bindEventRepository(
        impl: MockEventRepositoryImpl
    ): EventRepository
}
