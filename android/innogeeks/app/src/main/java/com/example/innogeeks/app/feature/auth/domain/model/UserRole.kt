package com.example.innogeeks.app.feature.auth.domain.model

/**
 * User roles as defined in PRD Section 2.2
 */
enum class UserRole {
    CORE_TEAM,      // Super Admin - Full system access
    COORDINATOR,    // Admin - Manage attendance and resources
    MEMBER,         // User - View resources, personal stats
    ALUMNI,         // User - Network access, event archives
    GUEST           // Public - View public events only
}
