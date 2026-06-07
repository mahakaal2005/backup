package com.example.notesapp.graph

import android.content.Context
import androidx.room.Room
import com.example.notesapp.data.database.NotesDatabase
import com.example.notesapp.data.repository.NoteRepository

object Graph {
    lateinit var database: NotesDatabase

    val notesRepository by lazy {
        NoteRepository(noteDao = database.noteDao())
    }

    fun provide(context: Context){
        database = Room.databaseBuilder(context , NotesDatabase::class.java,"notes.db").build()
    }
}