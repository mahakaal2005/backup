package com.example.notes2app.data.repository

import com.example.notes2app.data.dao.NoteDao
import com.example.notes2app.data.entity.Note
import kotlinx.coroutines.flow.Flow

class NotesRepository(private val noteDao: NoteDao) {

    suspend fun insertNote(note: Note){
        noteDao.insertNote(note)
    }

    suspend fun updateNote(note: Note){
        noteDao.updateNote(note)
    }

    suspend fun deleteNote(note: Note){
        noteDao.deleteNote(note)
    }

    fun getAllNotes() : Flow<List<Note>>{
         return noteDao.getAllNotes()
    }

    fun getNoteById(id : Long) : Flow<Note>{
        return noteDao.getNoteById(id)
    }
}