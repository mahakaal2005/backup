package com.example.innogeeks.app.core.presentation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.innogeeks.app.core.presentation.components.AppBottomBar
import com.example.innogeeks.app.feature.analytics.presentation.AnalyticsScreen
import com.example.innogeeks.app.feature.attendance.presentation.AttendanceListScreen
import com.example.innogeeks.app.feature.attendance.presentation.TakeAttendanceScreen
import com.example.innogeeks.app.feature.auth.presentation.login.LoginScreen
import com.example.innogeeks.app.feature.dashboard.presentation.DashboardScreen
import com.example.innogeeks.app.feature.dashboard.presentation.DashboardViewModel
import com.example.innogeeks.app.feature.events.presentation.EventsScreen
import com.example.innogeeks.app.feature.members.presentation.MembersScreen
import com.example.innogeeks.app.feature.profile.presentation.ProfileScreen
import com.example.innogeeks.app.feature.resources.presentation.ResourcesScreen

@Composable
fun AppNavHost() {
    var isAuthenticated by rememberSaveable { mutableStateOf(false) }
    
    if (!isAuthenticated) {
        LoginScreen(onNavigateToHome = { isAuthenticated = true })
    } else {
        MainAppContent(onLogout = { isAuthenticated = false })
    }
}

@Composable
private fun MainAppContent(
    onLogout: () -> Unit,
    dashboardViewModel: DashboardViewModel = hiltViewModel()
) {
    val dashboardState by dashboardViewModel.state.collectAsStateWithLifecycle()
    val userRole = dashboardState.user?.role
    
    val navController = rememberNavController()
    var selectedRoute by rememberSaveable { mutableStateOf("home") }
    
    // Check if bottom bar should be hidden
    val currentRoute = navController.currentBackStackEntry?.destination?.route
    val hideBottomBarRoutes = listOf("take_attendance")
    val showBottomBar = currentRoute !in hideBottomBarRoutes
    
    // Use Box to overlay nav on top of content (truly floating)
    Box(modifier = Modifier.fillMaxSize()) {
        // Content layer - takes full screen
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.fillMaxSize()
        ) {
            // Common routes
            composable("home") { 
                DashboardScreen(
                    onNavigateToAttendance = { 
                        navController.navigate("take_attendance")
                    }
                )
            }
            
            composable("profile") { 
                ProfileScreen(onLogout = onLogout)
            }
            
            // Member/Coordinator routes
            composable("resources") { ResourcesScreen() }
            composable("events") { EventsScreen() }
            
            // Coordinator routes
            composable("attendance") { 
                AttendanceListScreen(
                    onTakeAttendance = { navController.navigate("take_attendance") }
                )
            }
            composable("take_attendance") {
                TakeAttendanceScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            
            // Core Team routes
            composable("analytics") { AnalyticsScreen() }
            composable("members") { MembersScreen() }
        }
        
        // Floating bottom bar layer - overlays content
        if (showBottomBar) {
            AppBottomBar(
                userRole = userRole,
                selectedRoute = selectedRoute,
                onItemSelected = { route ->
                    selectedRoute = route
                    navController.navigate(route) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }
}
