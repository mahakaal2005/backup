package com.example.innogeeks.app.feature.auth.data.repository

import com.example.innogeeks.app.feature.auth.domain.model.User
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Mock implementation of AuthRepository for development.
 * Swap with FirebaseAuthRepositoryImpl when google-services.json is available.
 */
@Singleton
class MockAuthRepositoryImpl @Inject constructor() : AuthRepository {
    
    private val _currentUser = MutableStateFlow<User?>(null)
    override val currentUser: Flow<User?> = _currentUser.asStateFlow()
    
    private val registeredUsers = listOf(
        User(
            id = "1",
            email = "coordinator@college.edu",
            fullName = "Test Coordinator",
            role = UserRole.COORDINATOR,
            domain = "Android",
            year = 2,
            regId = "2200001"
        ),
        User(
            id = "2",
            email = "member@college.edu",
            fullName = "Test Member",
            role = UserRole.MEMBER,
            domain = "Android",
            year = 1,
            regId = "2300001"
        ),
        User(
            id = "3",
            email = "core@college.edu",
            fullName = "Test Core Team",
            role = UserRole.CORE_TEAM,
            domain = null,
            year = 3,
            regId = "2100001"
        )
    )
    
    override suspend fun isAuthenticated(): Boolean {
        return _currentUser.value != null
    }
    
    override suspend fun signInWithGoogle(idToken: String): Result<User> {
        kotlinx.coroutines.delay(1000)
        
        val user = registeredUsers.find { it.email == idToken }
        
        return if (user != null) {
            _currentUser.value = user
            Result.success(user)
        } else {
            Result.failure(Exception("EMAIL_MISMATCH"))
        }
    }
    
    override suspend fun verifyByRegId(regId: String): Result<String?> {
        kotlinx.coroutines.delay(500)
        
        val user = registeredUsers.find { it.regId == regId }
        
        return if (user != null) {
            val email = user.email
            val maskedEmail = email.take(1) + "***" + email.substring(email.indexOf("@") - 1)
            Result.success(maskedEmail)
        } else {
            Result.success(null)
        }
    }
    
    override suspend fun continueAsGuest(): Result<User> {
        val guestUser = User(
            id = "guest_${System.currentTimeMillis()}",
            email = "",
            fullName = "Guest",
            role = UserRole.GUEST,
            domain = null,
            year = null,
            regId = null
        )
        _currentUser.value = guestUser
        return Result.success(guestUser)
    }
    
    override suspend fun signOut() {
        _currentUser.value = null
    }
}
