package com.example.innogeeks.app.di

import com.example.innogeeks.app.feature.resources.data.repository.MockResourceRepositoryImpl
import com.example.innogeeks.app.feature.resources.domain.repository.ResourceRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class ResourceModule {
    
    @Binds
    @Singleton
    abstract fun bindResourceRepository(
        impl: MockResourceRepositoryImpl
    ): ResourceRepository
}
