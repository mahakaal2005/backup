package com.example.notes2app.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.notes2app.data.entity.Note
import com.example.notes2app.navigation.Screen
import com.example.notes2app.ui.component.NoteItem
import com.example.notes2app.ui.component.TopAppBar
import com.example.notes2app.viewmodel.NotesViewmodel

@Composable
fun HomeScreen(
    viewModel: NotesViewmodel,
    navController: NavController
) {

    val notesList = viewModel.getAllNotes().collectAsStateWithLifecycle(listOf())

    Scaffold(
        topBar = {
            TopAppBar(
                onBackIconClicked = {}
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    navController.navigate("${Screen.NoteAddEditScreen.route}/0")
                },
                containerColor = Color.Black
            ){
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    tint = Color.White
                )
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding),
            contentPadding = PaddingValues(10.dp)

        ) {
            items(items = notesList.value, key = {it.id}){note ->

                val dismissBoxState = rememberSwipeToDismissBoxState(
                    confirmValueChange = {value ->
                        if( value == SwipeToDismissBoxValue.EndToStart) {
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
                        val color= if(dismissBoxState.dismissDirection== SwipeToDismissBoxValue.Settled)
                            Color.Transparent
                        else Color.Red
                        Box(Modifier
                            .fillMaxSize()
                            .padding(8.dp)
                            .background(color=color , shape = RoundedCornerShape(16.dp))
                            .padding(end = 16.dp),
                            contentAlignment = Alignment.CenterEnd){
                            if(dismissBoxState.dismissDirection == SwipeToDismissBoxValue.EndToStart){
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    tint = Color.Black,
                                    contentDescription = null
                                )
                            }
                        }
                    }
                ) {
                    NoteItem(
                        title = note.title,
                        description = note.description,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable(
                                onClick = {
                                    navController.navigate(Screen.NoteAddEditScreen.route + "/${note.id}")
                                }
                            )
                    )
                }
            }
        }
    }
}