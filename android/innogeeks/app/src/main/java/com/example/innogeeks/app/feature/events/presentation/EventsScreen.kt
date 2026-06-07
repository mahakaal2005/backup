package com.example.innogeeks.app.feature.events.presentation

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.innogeeks.app.R
import com.example.innogeeks.app.feature.dashboard.presentation.components.ShimmerBox
import com.example.innogeeks.app.feature.events.presentation.components.ScheduledEventCard
import com.example.innogeeks.app.feature.resources.presentation.GuestRestrictionView
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun EventsScreen(
    viewModel: EventsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        floatingActionButton = {
            // Only show FAB for Coordinators/Core Team
            if (state.canCreateEvent && !state.isGuest) {
                FloatingActionButton(
                    onClick = {
                        scope.launch {
                            snackbarHostState.showSnackbar("Create event feature coming soon!")
                        }
                    },
                    containerColor = MaterialTheme.colorScheme.primary
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Create Event")
                }
            }
        }
    ) { padding ->
        // Guest restriction
        if (state.isGuest && !state.isLoading) {
            GuestRestrictionView(
                modifier = Modifier.padding(padding),
                featureName = "Events"
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 16.dp)
            ) {
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = stringResource(R.string.events_title),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Domain filter chips
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    EVENT_DOMAIN_FILTERS.forEach { domain ->
                        val isSelected = when {
                            domain == "All" -> state.selectedDomainFilter == null
                            else -> state.selectedDomainFilter == domain
                        }
                        
                        FilterChip(
                            selected = isSelected,
                            onClick = { 
                                viewModel.onEvent(EventsEvent.OnDomainFilterSelected(domain))
                            },
                            label = { Text(domain) }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                if (state.isLoading) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        repeat(3) { ShimmerBox(height = 120.dp) }
                    }
                } else if (state.events.isEmpty()) {
                    Text(
                        text = stringResource(R.string.events_empty),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        contentPadding = PaddingValues(bottom = 80.dp)
                    ) {
                        itemsIndexed(
                            items = state.events,
                            key = { _, event -> event.id }
                        ) { index, event ->
                            var visible by remember { mutableStateOf(false) }
                            
                            LaunchedEffect(Unit) {
                                delay(index * 50L)
                                visible = true
                            }
                            
                            AnimatedVisibility(
                                visible = visible,
                                enter = fadeIn() + slideInVertically { it / 2 }
                            ) {
                                ScheduledEventCard(event = event)
                            }
                        }
                    }
                }
            }
        }
    }
}
