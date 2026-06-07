package com.example.innogeeks.app.feature.dashboard.presentation

import android.content.res.Configuration
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.innogeeks.app.R
import com.example.innogeeks.app.core.presentation.designsystem.AppTheme
import com.example.innogeeks.app.core.presentation.designsystem.ThemeMode
import com.example.innogeeks.app.feature.auth.domain.model.UserRole
import com.example.innogeeks.app.feature.dashboard.domain.model.CoordinatorStats
import com.example.innogeeks.app.feature.dashboard.domain.model.CoreTeamStats
import com.example.innogeeks.app.feature.dashboard.domain.model.StudentStats
import com.example.innogeeks.app.feature.dashboard.presentation.components.AttendanceRing
import com.example.innogeeks.app.feature.dashboard.presentation.components.EventCard
import com.example.innogeeks.app.feature.dashboard.presentation.components.ShimmerBox
import com.example.innogeeks.app.feature.dashboard.presentation.components.StatCard
import com.example.innogeeks.app.feature.events.domain.model.Event
import kotlinx.coroutines.delay

@Composable
fun DashboardScreen(
    onNavigateToAttendance: () -> Unit = {},
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    
    Box(modifier = Modifier.fillMaxSize()) {
        when {
            state.isLoading -> DashboardLoading()
            state.user == null -> GuestDashboard()
            else -> {
                when (state.user?.role) {
                    UserRole.MEMBER, UserRole.ALUMNI -> StudentDashboard(
                        stats = state.studentStats,
                        events = state.upcomingEvents
                    )
                    UserRole.COORDINATOR -> CoordinatorDashboard(
                        stats = state.coordinatorStats,
                        events = state.upcomingEvents,
                        onLogAttendance = onNavigateToAttendance
                    )
                    UserRole.CORE_TEAM -> CoreTeamDashboard(
                        stats = state.coreTeamStats,
                        events = state.upcomingEvents
                    )
                    UserRole.GUEST, null -> GuestDashboard()
                }
            }
        }
    }
}

@Composable
private fun DashboardLoading() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        ShimmerBox(height = 200.dp)
        ShimmerBox(height = 100.dp)
        ShimmerBox(height = 100.dp)
    }
}

@Composable
private fun StudentDashboard(
    stats: StudentStats?,
    events: List<Event>
) {
    var showContent by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        delay(100)
        showContent = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))
        
        // Attendance Ring
        AnimatedVisibility(
            visible = showContent && stats != null,
            enter = fadeIn() + slideInVertically { -it / 2 }
        ) {
            stats?.let {
                AttendanceRing(
                    percentage = it.attendancePercent,
                    domain = it.domain
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Stats Row
        AnimatedVisibility(
            visible = showContent && stats != null,
            enter = fadeIn() + slideInVertically { it / 2 }
        ) {
            stats?.let {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        value = it.attendedClasses.toString(),
                        label = stringResource(R.string.dashboard_attended),
                        modifier = Modifier.weight(1f)
                    )
                    StatCard(
                        value = it.totalClasses.toString(),
                        label = stringResource(R.string.dashboard_total_classes),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Upcoming Events
        events.forEachIndexed { index, event ->
            AnimatedVisibility(
                visible = showContent,
                enter = fadeIn() + slideInVertically { it / 2 }
            ) {
                EventCard(event = event, modifier = Modifier.padding(vertical = 4.dp))
            }
        }
    }
}

@Composable
private fun CoordinatorDashboard(
    stats: CoordinatorStats?,
    events: List<Event>,
    onLogAttendance: () -> Unit
) {
    var showContent by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        delay(100)
        showContent = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = stringResource(R.string.dashboard_coordinator_title),
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Log Attendance Button
        AnimatedVisibility(
            visible = showContent,
            enter = fadeIn() + slideInVertically { -it / 2 }
        ) {
            Button(
                onClick = onLogAttendance,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(stringResource(R.string.dashboard_log_attendance))
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Stats Row
        AnimatedVisibility(
            visible = showContent && stats != null,
            enter = fadeIn() + slideInVertically { it / 2 }
        ) {
            stats?.let {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        value = it.studentsInDomain.toString(),
                        label = stringResource(R.string.dashboard_students),
                        modifier = Modifier.weight(1f)
                    )
                    StatCard(
                        value = it.totalClasses.toString(),
                        label = stringResource(R.string.dashboard_classes),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Last Topic
        stats?.lastClassTopic?.let { topic ->
            AnimatedVisibility(
                visible = showContent,
                enter = fadeIn()
            ) {
                Column {
                    Text(
                        text = stringResource(R.string.dashboard_last_topic),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = topic,
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Upcoming Events
        events.forEach { event ->
            AnimatedVisibility(
                visible = showContent,
                enter = fadeIn() + slideInVertically { it / 2 }
            ) {
                EventCard(event = event, modifier = Modifier.padding(vertical = 4.dp))
            }
        }
    }
}

@Composable
private fun CoreTeamDashboard(
    stats: CoreTeamStats?,
    events: List<Event>
) {
    var showContent by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        delay(100)
        showContent = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = stringResource(R.string.dashboard_core_title),
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Overview Stats
        AnimatedVisibility(
            visible = showContent && stats != null,
            enter = fadeIn() + slideInVertically { it / 2 }
        ) {
            stats?.let {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard(
                        value = it.totalMembers.toString(),
                        label = stringResource(R.string.dashboard_total_members),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatCard(
                            value = "${(it.firstYearAttendance * 100).toInt()}%",
                            label = stringResource(R.string.dashboard_first_year),
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            value = "${(it.secondYearAttendance * 100).toInt()}%",
                            label = stringResource(R.string.dashboard_second_year),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Upcoming Events
        events.forEach { event ->
            AnimatedVisibility(
                visible = showContent,
                enter = fadeIn() + slideInVertically { it / 2 }
            ) {
                EventCard(event = event, modifier = Modifier.padding(vertical = 4.dp))
            }
        }
    }
}

@Composable
private fun GuestDashboard() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(R.string.dashboard_guest_title),
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.dashboard_guest_subtitle),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Preview(showBackground = true, name = "Student")
@Composable
private fun StudentDashboardPreview() {
    AppTheme(themeMode = ThemeMode.DARK) {
        StudentDashboard(
            stats = StudentStats(0.85f, "Android", 20, 17),
            events = listOf(
                Event(
                    id = "1",
                    title = "Jetpack Compose",
                    room = "Room 304",
                    domain = "Android",
                    scheduledDate = System.currentTimeMillis() + 135 * 60 * 1000,
                    createdBy = "coord_1"
                )
            )
        )
    }
}

@Preview(showBackground = true, name = "Coordinator", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
private fun CoordinatorDashboardPreview() {
    AppTheme(themeMode = ThemeMode.DARK) {
        CoordinatorDashboard(
            stats = CoordinatorStats(24, 12, "Navigation Compose"),
            events = emptyList(),
            onLogAttendance = {}
        )
    }
}
