package com.example.innogeeks.app.feature.resources.data.repository

import com.example.innogeeks.app.feature.resources.domain.model.Resource
import com.example.innogeeks.app.feature.resources.domain.model.ResourceType
import com.example.innogeeks.app.feature.resources.domain.repository.ResourceRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MockResourceRepositoryImpl @Inject constructor() : ResourceRepository {
    
    private val mockResources = listOf(
        Resource(
            id = "r1",
            title = "Jetpack Compose Basics",
            description = "Official Android docs for Compose fundamentals",
            domain = "Android",
            type = ResourceType.ARTICLE,
            url = "https://developer.android.com/develop/ui/compose",
            uploadedBy = "coord_1",
            uploadedAt = System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000
        ),
        Resource(
            id = "r2",
            title = "Compose Navigation Codelab",
            description = "Step-by-step navigation tutorial",
            domain = "Android",
            type = ResourceType.ARTICLE,
            url = "https://developer.android.com/codelabs/jetpack-compose-navigation",
            uploadedBy = "coord_1",
            uploadedAt = System.currentTimeMillis() - 3 * 24 * 60 * 60 * 1000
        ),
        Resource(
            id = "r3",
            title = "React Hooks Tutorial",
            description = "Comprehensive guide to React Hooks",
            domain = "Web",
            type = ResourceType.VIDEO,
            url = "https://www.youtube.com/watch?v=dpw9EHDh2bM",
            uploadedBy = "coord_2",
            uploadedAt = System.currentTimeMillis() - 5 * 24 * 60 * 60 * 1000
        ),
        Resource(
            id = "r4",
            title = "TensorFlow Quickstart",
            description = "Get started with TensorFlow for ML",
            domain = "ML",
            type = ResourceType.ARTICLE,
            url = "https://www.tensorflow.org/tutorials/quickstart/beginner",
            uploadedBy = "coord_3",
            uploadedAt = System.currentTimeMillis() - 10 * 24 * 60 * 60 * 1000
        ),
        Resource(
            id = "r5",
            title = "Clean Architecture Sample",
            description = "Official Android architecture samples repo",
            domain = "Android",
            type = ResourceType.GITHUB,
            url = "https://github.com/android/architecture-samples",
            uploadedBy = "core_1",
            uploadedAt = System.currentTimeMillis() - 14 * 24 * 60 * 60 * 1000
        ),
        Resource(
            id = "r6",
            title = "Kotlin Coroutines Guide",
            description = "Official Kotlin coroutines documentation",
            domain = "Android",
            type = ResourceType.PDF,
            url = "https://kotlinlang.org/docs/coroutines-guide.html",
            uploadedBy = "coord_1",
            uploadedAt = System.currentTimeMillis() - 2 * 24 * 60 * 60 * 1000
        )
    )
    
    override fun getAllResources(): Flow<List<Resource>> = flow {
        delay(300)
        emit(mockResources.sortedByDescending { it.uploadedAt })
    }
    
    override fun getResourcesByDomain(domain: String): Flow<List<Resource>> = flow {
        delay(300)
        emit(mockResources.filter { it.domain == domain }.sortedByDescending { it.uploadedAt })
    }
    
    override fun searchResources(query: String): Flow<List<Resource>> = flow {
        delay(200)
        val lowerQuery = query.lowercase()
        emit(mockResources.filter { 
            it.title.lowercase().contains(lowerQuery) ||
            it.description?.lowercase()?.contains(lowerQuery) == true ||
            it.domain.lowercase().contains(lowerQuery)
        })
    }
    
    override suspend fun addResource(resource: Resource): Result<Resource> {
        delay(500)
        return Result.success(resource)
    }
}
