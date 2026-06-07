package com.example.notesapp.viewmodels

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.notesapp.data.entity.Note
import com.example.notesapp.data.repository.NoteRepository
import com.example.notesapp.graph.Graph
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

class NotesViewModel(
    private val noteRepository: NoteRepository = Graph.notesRepository
) : ViewModel(){

    private var _currentId by  mutableStateOf(0L)
    val currentId : Long
        get() =_currentId

    private var _noteTitleState by  mutableStateOf("")
    val noteTitleState : String
        get() = _noteTitleState


    private var _noteDescriptionState by mutableStateOf("")
    val noteDescriptionState : String
        get() = _noteDescriptionState

    fun onNoteTitleCahnged(newTitle: String){
        _noteTitleState = newTitle
    }

    fun onNoteDescriptionChanged(newDescription: String){
        _noteDescriptionState= newDescription
    }

    fun onNoteIdCahnged(id: Long){
        _currentId  = id
    }


    fun insertNote(note: Note){
        viewModelScope.launch {
            noteRepository.insertNote(note)
        }
    }

    fun updateNote(note: Note){
        viewModelScope.launch {
            noteRepository.updateNote(note)
        }
    }

    fun deleteNote(note: Note){
        viewModelScope.launch {
            noteRepository.deleteNote(note)
        }
    }

    fun getNoteById(id: Long) : Flow<Note>{
        return noteRepository.getNoteById(id)
    }

    fun getAllNotes(): Flow<List<Note>>{
        return noteRepository.getAllNotes()
    }
}