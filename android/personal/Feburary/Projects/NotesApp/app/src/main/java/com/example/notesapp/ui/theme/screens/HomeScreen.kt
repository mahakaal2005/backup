package com.example.notesapp.ui.theme.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ShapeDefaults
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.notesapp.navigation.Screen
import com.example.notesapp.ui.theme.componenets.HomeNoteItem
import com.example.notesapp.ui.theme.componenets.TopAppBar
import com.example.notesapp.viewmodels.NotesViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: NotesViewModel, navController: NavController, modifier: Modifier = Modifier
) {

    val snackbarHostState = remember { SnackbarHostState() }
    val notesList = viewModel.getAllNotes().collectAsStateWithLifecycle(listOf())

    Scaffold(topBar = {
        TopAppBar("Note List")
    }, snackbarHost = { SnackbarHost(snackbarHostState) }, floatingActionButton = {
        FloatingActionButton(
            onClick = {
                navController.navigate(Screen.NoteAddEditScreen.route + "/0")
            },
            containerColor = Color.Black,
            contentColor = Color.White,
            shape = ShapeDefaults.Medium
        ) {
            Icon(
                imageVector = Icons.Default.Add, contentDescription = null
            )
        }
    }) {

        LazyColumn(
            modifier = Modifier.padding(it),
            contentPadding = PaddingValues(8.dp)
        ) {
            items(items = notesList.value, key = { it.id }) { note ->
                val dismissBoxState = rememberSwipeToDismissBoxState(
                    confirmValueChange = {value ->
                        if( value == SwipeToDismissBoxValue.EndToStart){
                            viewModel.deleteNote(note)
                             true
                        }else{
                            false
                        }
                    }
                )
                SwipeToDismissBox(
                    state = dismissBoxState,
                    backgroundContent = {
                        val color = if(dismissBoxState.dismissDirection == dismissBoxState.settledValue ||
                            dismissBoxState.dismissDirection == SwipeToDismissBoxValue.StartToEnd
                            ) Color.Transparent else Color.Red
                        Box(Modifier.fillMaxWidth().fillMaxHeight().background(color),
                            contentAlignment = Alignment.CenterEnd){
                            if (dismissBoxState.dismissDirection == SwipeToDismissBoxValue.EndToStart){
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    contentDescription = null,
                                    tint = Color.White
                                )
                            }
                        }
                    },
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    HomeNoteItem(note, onNoteCLicked = {
                        navController.navigate(Screen.NoteAddEditScreen.route + "/${note.id}")
                    })
                }

            }
        }
    }
}