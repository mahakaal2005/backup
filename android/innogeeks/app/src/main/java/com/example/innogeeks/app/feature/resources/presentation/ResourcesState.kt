package com.example.innogeeks.app.feature.resources.presentation

import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.resources.domain.model.Resource

data class ResourcesState(
    val isLoading: Boolean = true,
    val resources: List<Resource> = emptyList(),
    val selectedDomainFilter: String? = null,
    val searchQuery: String = "",
    val userRole: UserRole? = null,
    val isGuest: Boolean = true,  // Default to true until loaded
    val canUpload: Boolean = false,  // Coordinators + Core Team only
    val error: String? = null
)

val DOMAIN_FILTERS = listOf("All", "Android", "Web", "ML", "IoT", "Blockchain")
