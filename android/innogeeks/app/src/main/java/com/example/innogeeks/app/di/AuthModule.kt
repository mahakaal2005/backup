package com.example.innogeeks.app.di

import com.example.innogeeks.app.feature.auth.data.repository.FirebaseAuthRepositoryImpl
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Authentication feature.
 * Uses @Binds to bind interface to implementation.
 * 
 * Now using Firebase implementation for production.
 * To swap back to mock: change FirebaseAuthRepositoryImpl to MockAuthRepositoryImpl
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class AuthModule {
    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        impl: FirebaseAuthRepositoryImpl
    ): AuthRepository
}
