package com.example.notes2app.data.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.notes2app.data.entity.Note
import kotlinx.coroutines.flow.Flow

@Dao
abstract class NoteDao(){
    @Insert
    abstract suspend fun insertNote(noteEntity : Note)

    @Update
    abstract suspend fun updateNote(noteEntity : Note)

    @Delete
    abstract suspend fun deleteNote(noteEntity : Note)

    @Query("Select * from `notes_table`")
    abstract fun getAllNotes() : Flow<List<Note>>

    @Query("Select * from `notes_table` where id = :id")
    abstract fun getNoteById(id : Long) : Flow<Note>
}