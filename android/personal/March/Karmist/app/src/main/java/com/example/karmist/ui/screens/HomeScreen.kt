package com.example.karmist.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.karmist.data.model.FilterType
import com.example.karmist.data.model.KarmSource
import com.example.karmist.navigation.Screen
import com.example.karmist.ui.components.KarmItem
import com.example.karmist.ui.components.TopAppBar
import com.example.karmist.ui.event.HomeUiEvent
import com.example.karmist.ui.state.HomeUiState
import com.example.karmist.ui.state.RefreshUiState
import com.example.karmist.viewmodel.KarmViewModel
import kotlinx.coroutines.flow.collectLatest
import java.text.SimpleDateFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: KarmViewModel,
    navController: NavController,
    modifier: Modifier = Modifier
) {

    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val filterType by viewModel.filterType.collectAsStateWithLifecycle()
    val focusManager = LocalFocusManager.current
    val homeScreenState by viewModel.homeScreenState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    Scaffold(
        topBar = {
            TopAppBar( onCheckboxClicked = {}, onBackButtonClicked = {})
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate(Screen.KarmScreen.route + "/0") },
                containerColor = Color.Black
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    tint = Color.White
                )
            }
        },
        snackbarHost = {SnackbarHost(hostState = snackbarHostState)}
    ) { paddingValues ->

        // Phase 2: Use the StateFlow from ViewModel.
        // This is reactive: UI updates automatically when DB changes.

        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .pointerInput(Unit) {
                    detectTapGestures(onTap = { focusManager.clearFocus() })
                }
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = { Text("Search your karms...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterType.entries.forEach { type->
                    FilterChip(
                        selected = filterType == type,
                        onClick = {viewModel.onFilterChanged(type)},
                        label = {Text(type.name.lowercase().replaceFirstChar { it.uppercase() })}
                    )

                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = { viewModel.manualRefresh() }) {
                    Text("Refresh")
                }
            }

            when (val refreshState = homeScreenState.refreshState) {
                RefreshUiState.Idle -> Unit
                RefreshUiState.Loading -> {
                    LinearProgressIndicator(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }
                is RefreshUiState.Success -> Unit
                is RefreshUiState.Error -> {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = refreshState.message,
                            color = MaterialTheme.colorScheme.error,
                            modifier = Modifier.weight(1f)
                        )
                        TextButton(onClick = { viewModel.retryRefresh() }) {
                            Text("Retry")
                        }
                    }
                }
            }

            when(val state = homeScreenState.listState){
                HomeUiState.Loading -> {
                    LinearProgressIndicator(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }

                HomeUiState.Empty -> {
                    Text(
                        text = "No tasks yet",
                        modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodyLarge
                    )
            }

                HomeUiState.EmptyFiltered -> {
                    Text(
                        text = "No tasks match the current search or filters",
                        modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodyLarge
                    )
                }

                is HomeUiState.Success ->{
                    state.syncedAt?.let { syncedAt ->
                        val text = SimpleDateFormat("hh:mm a", Locale.getDefault())
                            .format(syncedAt)

                        Text(
                            text = "Synced at $text",
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    LazyColumn {
                        items(state.karms, key = { it.id }) { item ->
                            val isLocalItem = item.source == KarmSource.LOCAL

                            if (isLocalItem) {
                                // Phase 1: Delete logic using SwipeToDismiss
                                val dismissState = rememberSwipeToDismissBoxState(
                                    positionalThreshold = { totalDistance ->
                                        totalDistance * 0.8f
                                    },
                                    confirmValueChange = {
                                        if (it == SwipeToDismissBoxValue.EndToStart || it == SwipeToDismissBoxValue.StartToEnd) {
                                            viewModel.onKarmSwipedToDelete(item)
                                            true
                                        } else {
                                            false
                                        }
                                    }
                                )

                                SwipeToDismissBox(
                                    state = dismissState,
                                    backgroundContent = {
                                        val color = if (dismissState.dismissDirection == SwipeToDismissBoxValue.EndToStart || dismissState.dismissDirection == SwipeToDismissBoxValue.StartToEnd) {
                                            MaterialTheme.colorScheme.errorContainer
                                        } else {
                                            Color.Transparent
                                        }
                                        
                                        val alignment = if (dismissState.dismissDirection == SwipeToDismissBoxValue.StartToEnd) {
                                            Alignment.CenterStart
                                        } else {
                                            Alignment.CenterEnd
                                        }
                                        
                                        val iconPadding = if (dismissState.dismissDirection == SwipeToDismissBoxValue.StartToEnd) {
                                            Modifier.padding(start = 16.dp)
                                        } else {
                                            Modifier.padding(end = 16.dp)
                                        }

                                        Box(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .padding(horizontal = 16.dp, vertical = 8.dp)
                                                .background(color, MaterialTheme.shapes.medium),
                                            contentAlignment = alignment
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Delete",
                                                modifier = iconPadding,
                                                tint = MaterialTheme.colorScheme.error
                                            )
                                        }
                                    },
                                    enableDismissFromStartToEnd = true
                                ) {
                                    KarmItem(
                                        description = item.description,
                                        isCompleted = item.completed,
                                        date = item.date,
                                        source = item.source,
                                        enabled = true,
                                        onCheckedChange = { checked ->
                                            // Phase 2: Checkbox toggle directly updates Room
                                            viewModel.updateKarm(item.copy(completed = checked))
                                        },
                                        modifier = Modifier.clickable {
                                            navController.navigate(Screen.KarmScreen.route + "/${item.id}")
                                        }
                                    )
                                }
                            } else {
                                KarmItem(
                                    description = item.description,
                                    isCompleted = item.completed,
                                    date = item.date,
                                    source = item.source,
                                    enabled = false,
                                    onCheckedChange = {},
                                    modifier = Modifier
                                )
                            }
                        }
                    }
                }

                is HomeUiState.Error -> {
                    Text(
                        text = state.message,
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }

            LaunchedEffect(Unit) {
                viewModel.homeUiEvent.collectLatest { event ->
                    when(event){
                        is HomeUiEvent.ShowUndoDelete ->{
                            val result = snackbarHostState.showSnackbar(
                                message = "Task deleted",
                                actionLabel = "Undo",
                                duration = SnackbarDuration.Short
                            )
                            if(result == SnackbarResult.ActionPerformed){
                                viewModel.undoDelete(event.karm)
                            }
                        }
                    }
                }
            }

        }
    }
}
