package com.example.innogeeks.app.feature.auth.data.repository

import com.example.innogeeks.app.feature.auth.domain.model.User
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Firebase implementation of AuthRepository.
 * Handles authentication with Firebase Auth and user data with Firestore.
 * 
 * Authentication flow:
 * 1. Google Sign-In → Firebase Auth
 * 2. Check if user exists in Firestore
 * 3. If not found → check by RegID
 * 4. If RegID not found → Guest access
 */
@Singleton
class FirebaseAuthRepositoryImpl @Inject constructor(
    private val auth: FirebaseAuth,
    private val firestore: FirebaseFirestore
) : AuthRepository {
    
    companion object {
        private const val USERS_COLLECTION = "users"
    }
    
    override val currentUser: Flow<User?> = callbackFlow {
        val authStateListener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            val firebaseUser = firebaseAuth.currentUser
            if (firebaseUser != null) {
                // Fetch user data from Firestore
                firestore.collection(USERS_COLLECTION)
                    .document(firebaseUser.uid)
                    .get()
                    .addOnSuccessListener { document ->
                        if (document.exists()) {
                            val user = document.toUser(firebaseUser.uid)
                            trySend(user)
                        } else {
                            trySend(null)
                        }
                    }
                    .addOnFailureListener {
                        trySend(null)
                    }
            } else {
                trySend(null)
            }
        }
        
        auth.addAuthStateListener(authStateListener)
        
        awaitClose {
            auth.removeAuthStateListener(authStateListener)
        }
    }
    
    override suspend fun isAuthenticated(): Boolean {
        return auth.currentUser != null
    }
    
    override suspend fun signInWithGoogle(idToken: String): Result<User> {
        return try {
            // Authenticate with Firebase using Google ID token
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val authResult = auth.signInWithCredential(credential).await()
            val firebaseUser = authResult.user ?: return Result.failure(Exception("Authentication failed"))
            
            // Check if user exists in Firestore
            val userDoc = firestore.collection(USERS_COLLECTION)
                .document(firebaseUser.uid)
                .get()
                .await()
            
            if (userDoc.exists()) {
                // User found in Firestore
                val user = userDoc.toUser(firebaseUser.uid)
                Result.success(user)
            } else {
                // User not found - check by email in Firestore
                val emailQuery = firestore.collection(USERS_COLLECTION)
                    .whereEqualTo("email", firebaseUser.email)
                    .get()
                    .await()
                
                if (!emailQuery.isEmpty) {
                    // Email found but different UID - update UID
                    val existingUser = emailQuery.documents.first()
                    val user = existingUser.toUser(firebaseUser.uid)
                    
                    // Update document with new UID
                    firestore.collection(USERS_COLLECTION)
                        .document(firebaseUser.uid)
                        .set(existingUser.data ?: emptyMap<String, Any>())
                        .await()
                    
                    Result.success(user)
                } else {
                    // Email not found - throw EMAIL_MISMATCH error
                    Result.failure(Exception("EMAIL_MISMATCH"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun verifyByRegId(regId: String): Result<String?> {
        return try {
            val query = firestore.collection(USERS_COLLECTION)
                .whereEqualTo("regId", regId)
                .get()
                .await()
            
            if (!query.isEmpty) {
                val userDoc = query.documents.first()
                val email = userDoc.getString("email") ?: return Result.success(null)
                
                // Create masked email hint
                val maskedEmail = email.take(1) + "***" + email.substring(email.indexOf("@") - 1)
                Result.success(maskedEmail)
            } else {
                Result.success(null)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun continueAsGuest(): Result<User> {
        return try {
            // Sign in anonymously with Firebase
            val authResult = auth.signInAnonymously().await()
            val firebaseUser = authResult.user ?: return Result.failure(Exception("Guest sign-in failed"))
            
            val guestUser = User(
                id = firebaseUser.uid,
                email = "",
                fullName = "Guest",
                role = UserRole.GUEST,
                domain = null,
                year = null,
                regId = null,
                photoUrl = null
            )
            
            Result.success(guestUser)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun signOut() {
        auth.signOut()
    }
    
    /**
     * Extension function to convert Firestore document to User domain model.
     */
    private fun com.google.firebase.firestore.DocumentSnapshot.toUser(uid: String): User {
        return User(
            id = uid,
            email = getString("email") ?: "",
            fullName = getString("fullName") ?: "",
            role = UserRole.valueOf(getString("role") ?: "GUEST"),
            domain = getString("domain"),
            year = getLong("year")?.toInt(),
            regId = getString("regId"),
            photoUrl = getString("photoUrl")
        )
    }
}
