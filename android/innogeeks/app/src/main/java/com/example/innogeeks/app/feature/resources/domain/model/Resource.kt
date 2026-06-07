package com.example.innogeeks.app.feature.resources.domain.model

/**
 * Resource item in the library.
 * All domains can view all resources (per PRD 3.3).
 */
data class Resource(
    val id: String,
    val title: String,
    val description: String? = null,
    val domain: String,            // Android, Web, ML, IoT, Blockchain
    val type: ResourceType,
    val url: String,               // External link
    val thumbnailUrl: String? = null,
    val uploadedBy: String,        // Coordinator/Core ID
    val uploadedAt: Long
)

enum class ResourceType {
    VIDEO,
    PDF,
    ARTICLE,
    GITHUB,
    OTHER
}
