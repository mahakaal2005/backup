package com.example.notesapp.ui.theme.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.notesapp.data.entity.Note
import com.example.notesapp.ui.theme.componenets.NotesTextField
import com.example.notesapp.ui.theme.componenets.TopAppBar
import com.example.notesapp.viewmodels.NotesViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

@Composable
fun NoteAddEditScreen(
    id : Long,
    viewModel: NotesViewModel,
    navController: NavController,
    modifier: Modifier = Modifier
) {


    val snackbarHostState = remember { SnackbarHostState() }

    val scope = rememberCoroutineScope()

    LaunchedEffect(id) {
        if(id != 0L) {
            // Load the note into ViewModel state
            val loadedNote = viewModel.getNoteById(id).first()  // Get first value
            viewModel.onNoteTitleCahnged(loadedNote.title)
            viewModel.onNoteDescriptionChanged(loadedNote.description)
            viewModel.onNoteIdCahnged(loadedNote.id)  // ✅ Set currentId
        } else {
            // Clear for new note
            viewModel.onNoteTitleCahnged("")
            viewModel.onNoteDescriptionChanged("")
            viewModel.onNoteIdCahnged(0L)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                if(id==0L)"Add Screen" else "Update Screen",
                onBackNavClicked = { navController.navigateUp() }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) {
        Column(
            modifier = Modifier.padding(it),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NotesTextField(
                "Title",
                viewModel.noteTitleState,
                { viewModel.onNoteTitleCahnged(it) }
            )
            Spacer(Modifier.height(8.dp))
            NotesTextField(
                "Description",
                viewModel.noteDescriptionState,
                { viewModel.onNoteDescriptionChanged(it) },
                singleLine = false,
                modifier = Modifier.weight(1f)
            )
            Spacer(Modifier.height(8.dp))
            ElevatedButton(
                onClick = {
                    if(viewModel.noteTitleState.isNotBlank() && viewModel.noteDescriptionState.isNotBlank()){
                        val note = Note(id = viewModel.currentId,title = viewModel.noteTitleState, description = viewModel.noteDescriptionState)

                        scope.launch {
                            if(viewModel.currentId != 0L){
                                viewModel.updateNote(note)
                            }
                            else viewModel.insertNote(note)

                            navController.navigateUp()
                        }
                    }else{
                       scope.launch {
                           snackbarHostState.showSnackbar("Add both title and description of the note")
                       }
                    }
                },
                colors = ButtonColors(
                    containerColor = Color.Green,
                    contentColor = Color.Black,
                    disabledContainerColor = Color.DarkGray,
                    disabledContentColor = Color.DarkGray
                )
            ) {
                Text(text = if(id==0L) "Add Note" else "Update Note", fontSize = 32.sp)
            }
        }
    }
}



