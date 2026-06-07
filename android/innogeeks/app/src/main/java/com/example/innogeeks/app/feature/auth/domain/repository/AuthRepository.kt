package com.example.innogeeks.app.feature.auth.domain.repository

import com.example.innogeeks.app.feature.auth.domain.model.User
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for authentication operations.
 * Defined in domain layer - implementation in data layer.
 * 
 * Authentication flow:
 * 1. Google Sign-In → email verification
 * 2. Email found → user logged in
 * 3. Email not found → RegID verification
 * 4. RegID found → show masked email hint
 * 5. RegID not found → Guest access
 */
interface AuthRepository {
    
    /**
     * Current authenticated user as a Flow for real-time updates.
     */
    val currentUser: Flow<User?>
    
    /**
     * Check if user is currently authenticated.
     */
    suspend fun isAuthenticated(): Boolean
    
    /**
     * Sign in with Google credential.
     * @return Result with User on success, error on failure
     */
    suspend fun signInWithGoogle(idToken: String): Result<User>
    
    /**
     * Verify user by Registration ID (for email mismatch case).
     * @return Masked email hint if found, null if not found
     */
    suspend fun verifyByRegId(regId: String): Result<String?>
    
    /**
     * Continue as Guest (no authentication).
     */
    suspend fun continueAsGuest(): Result<User>
    
    /**
     * Sign out current user.
     */
    suspend fun signOut()
}

/**
 * Typed errors for authentication operations.
 */
sealed interface AuthError {
    data object NetworkError : AuthError
    data object InvalidCredentials : AuthError
    data object UserNotFound : AuthError
    data object EmailMismatch : AuthError
    data class Unknown(val message: String) : AuthError
}
