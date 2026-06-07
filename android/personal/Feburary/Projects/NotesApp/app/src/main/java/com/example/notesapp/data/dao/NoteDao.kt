package com.example.notesapp.data.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.notesapp.data.entity.Note
import kotlinx.coroutines.flow.Flow

@Dao
abstract class NoteDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    abstract suspend fun insertNote(noteEntity: Note)

    @Update
    abstract suspend fun updateNote(noteEntity: Note)

    @Delete
    abstract suspend fun deleteNote(noteEntity: Note)

    @Query("select * from `notes_table`")
    abstract fun getAllNotes() : Flow<List<Note>>

    @Query("select * from `notes_table` where id=:id")
    abstract fun getNoteById(id: Long) : Flow<Note>
}