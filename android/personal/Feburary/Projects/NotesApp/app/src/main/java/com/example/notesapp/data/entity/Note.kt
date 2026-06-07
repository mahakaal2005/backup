package com.example.notesapp.data.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "notes_table")
data class Note(
    @PrimaryKey(autoGenerate = true)
    val id: Long=0L,
    @ColumnInfo("note_title")
    val title : String="default_title",
    @ColumnInfo("note_description")
    val description : String ="default_description"
)

