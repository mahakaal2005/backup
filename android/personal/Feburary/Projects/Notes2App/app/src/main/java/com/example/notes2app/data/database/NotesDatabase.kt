package com.example.notes2app.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.notes2app.data.dao.NoteDao
import com.example.notes2app.data.entity.Note

@Database(
    entities = [Note::class],
    version = 1,
    exportSchema = false
)
abstract class NotesDatabase : RoomDatabase(){

    abstract fun noteDao() : NoteDao
}