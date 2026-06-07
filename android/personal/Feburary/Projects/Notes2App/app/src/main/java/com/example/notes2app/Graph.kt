package com.example.notes2app

import android.content.Context
import androidx.room.Room
import com.example.notes2app.data.database.NotesDatabase
import com.example.notes2app.data.entity.Note
import com.example.notes2app.data.repository.NotesRepository

object Graph {
    lateinit var database: NotesDatabase

    val notesRepository by lazy {
        NotesRepository(database.noteDao())
    }

    fun provide(context: Context){
        database = Room.databaseBuilder(
            context ,
            NotesDatabase::class.java,
            "notes.db"
        ).build()
    }
}