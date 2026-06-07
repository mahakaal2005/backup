package com.example.notesapp.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.notesapp.data.dao.NoteDao
import com.example.notesapp.data.entity.Note

@Database(
    entities = [Note::class],
    version = 1,
    exportSchema = false
)
abstract class NotesDatabase : RoomDatabase(){
    abstract fun noteDao() : NoteDao
}