package com.example.innogeeks.app.feature.resources.domain.repository

import com.example.innogeeks.app.feature.resources.domain.model.Resource
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for Resources.
 * All users can access all resources regardless of domain.
 */
interface ResourceRepository {
    
    fun getAllResources(): Flow<List<Resource>>
    
    fun getResourcesByDomain(domain: String): Flow<List<Resource>>
    
    fun searchResources(query: String): Flow<List<Resource>>
    
    suspend fun addResource(resource: Resource): Result<Resource>
}
