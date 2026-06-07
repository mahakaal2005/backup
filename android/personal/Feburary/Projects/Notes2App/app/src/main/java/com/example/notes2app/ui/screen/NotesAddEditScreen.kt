package com.example.notes2app.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.notes2app.data.entity.Note
import com.example.notes2app.ui.component.NoteTextField
import com.example.notes2app.ui.component.TopAppBar
import com.example.notes2app.viewmodel.NotesViewmodel
import kotlinx.coroutines.launch

@Composable
fun NotesAddEditScreen(
    id : Long =0L,
    viewmodel: NotesViewmodel,
    navController: NavController
) {

    val scope = rememberCoroutineScope()

    val note = if(id != 0L) {
        viewmodel.getNoteById(id).collectAsStateWithLifecycle(Note()).value
    } else {
        Note()
    }

    LaunchedEffect(note){
        if(note.id != 0L) viewmodel.loadNoteData(note)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                if(id == 0L) "Add Note" else "Update Note",
                onBackIconClicked = {navController.popBackStack()}
            )
        }
    ) {paddingValues ->
        Column(
            modifier = Modifier.padding(paddingValues),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            NoteTextField(
                label = "Title",
                value = viewmodel.title,
                onValueChanged = {
                    viewmodel.onTitleChanged(it)
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(10.dp))
            NoteTextField(
                label = "Description",
                value = viewmodel.description,
                onValueChanged = {
                    viewmodel.onDescriptionChanged(it)
                },
                singleLine = false,
                modifier = Modifier.fillMaxWidth().fillMaxHeight(0.9f)
            )
            Spacer(Modifier.height(10.dp))
            Button(
                onClick = {
                    scope.launch {
                        val updatedNote = note.copy(
                            title = viewmodel.title,
                            description = viewmodel.description
                        )
                        if(id != 0L) viewmodel.updateNote(updatedNote)
                        else viewmodel.insertNote(updatedNote)
                    }
                    navController.popBackStack()
                }
            ) {
                Text(text = if(id!=0L)"Update Note" else "Add Note")
            }
        }
    }
}