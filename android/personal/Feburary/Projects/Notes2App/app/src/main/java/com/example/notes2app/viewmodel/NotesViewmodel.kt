package com.example.notes2app.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.notes2app.Graph
import com.example.notes2app.data.entity.Note
import com.example.notes2app.data.repository.NotesRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

class NotesViewmodel(
    private val notesRepository: NotesRepository = Graph.notesRepository
) : ViewModel() {

    private var _title by  mutableStateOf("")
    val title : String
        get() = _title

    private var _description by mutableStateOf("")
    val description : String
        get() = _description

    fun onTitleChanged(newTitle : String){
        _title = newTitle
    }

    fun onDescriptionChanged(newDescription : String){
        _description = newDescription
    }

    fun loadNoteData(note: Note){
        _title = note.title
        _description = note.description
    }

    fun getAllNotes() : Flow<List<Note>> {
        return notesRepository.getAllNotes()
    }

    fun getNoteById(id : Long) : Flow<Note>{
        return notesRepository.getNoteById(id)
    }

     fun updateNote(note: Note){
        viewModelScope.launch {
            notesRepository.updateNote(note)
        }
    }

     fun insertNote(note: Note){
        viewModelScope.launch {
            notesRepository.insertNote(note)
        }
        _title=""
        _description=""
    }

     fun deleteNote(note:Note){
        viewModelScope.launch {
            notesRepository.deleteNote(note)
        }
    }



}