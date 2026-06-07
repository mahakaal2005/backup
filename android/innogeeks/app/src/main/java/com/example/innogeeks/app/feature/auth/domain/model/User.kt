package com.example.innogeeks.app.feature.auth.domain.model

/**
 * Domain entity representing an authenticated user.
 * Pure Kotlin - no Android dependencies.
 * 
 * User data structure:
 * - RegID: University Registration ID (Primary Key in backend)
 * - Email, FullName, Role, Domain, Year
 */
data class User(
    val id: String,
    val email: String,
    val fullName: String,
    val role: UserRole,
    val domain: String?,       // e.g., "Android", "Web", "ML", "IoT", "Blockchain"
    val year: Int?,            // 1st year, 2nd year, etc.
    val regId: String?,        // University Registration ID
    val photoUrl: String? = null
)
