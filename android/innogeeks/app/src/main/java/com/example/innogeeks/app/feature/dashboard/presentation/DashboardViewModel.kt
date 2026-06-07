package com.example.innogeeks.app.feature.dashboard.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import com.example.innogeeks.app.feature.dashboard.domain.repository.DashboardRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val dashboardRepository: DashboardRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(DashboardState())
    val state = _state.asStateFlow()
    
    init {
        loadDashboard()
    }
    
    private fun loadDashboard() {
        viewModelScope.launch {
            authRepository.currentUser.collectLatest { user ->
                _state.update { it.copy(user = user, isLoading = true) }
                
                if (user == null) {
                    _state.update { it.copy(isLoading = false) }
                    return@collectLatest
                }
                
                // Load upcoming events for all users
                launch {
                    dashboardRepository.getUpcomingEvents().collectLatest { events ->
                        _state.update { it.copy(upcomingEvents = events) }
                    }
                }
                
                // Load role-specific stats
                when (user.role) {
                    UserRole.MEMBER, UserRole.ALUMNI -> loadStudentStats(user.id)
                    UserRole.COORDINATOR -> loadCoordinatorStats(user.domain ?: "Android")
                    UserRole.CORE_TEAM -> loadCoreTeamStats()
                    UserRole.GUEST -> _state.update { it.copy(isLoading = false) }
                }
            }
        }
    }
    
    private fun loadStudentStats(userId: String) {
        viewModelScope.launch {
            try {
                val stats = dashboardRepository.getStudentStats(userId).first()
                _state.update { it.copy(studentStats = stats, isLoading = false) }
            } catch (e: Exception) {
                _state.update { it.copy(error = e.message, isLoading = false) }
            }
        }
    }
    
    private fun loadCoordinatorStats(domain: String) {
        viewModelScope.launch {
            try {
                val stats = dashboardRepository.getCoordinatorStats(domain).first()
                _state.update { it.copy(coordinatorStats = stats, isLoading = false) }
            } catch (e: Exception) {
                _state.update { it.copy(error = e.message, isLoading = false) }
            }
        }
    }
    
    private fun loadCoreTeamStats() {
        viewModelScope.launch {
            try {
                val stats = dashboardRepository.getCoreTeamStats().first()
                _state.update { it.copy(coreTeamStats = stats, isLoading = false) }
            } catch (e: Exception) {
                _state.update { it.copy(error = e.message, isLoading = false) }
            }
        }
    }
}
