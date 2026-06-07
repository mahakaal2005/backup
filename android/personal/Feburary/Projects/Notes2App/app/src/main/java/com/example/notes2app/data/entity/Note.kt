package com.example.notes2app.data.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity("Notes_Table")
data class Note(
    @PrimaryKey(autoGenerate = true)
    val id : Long =0L,
    @ColumnInfo("Title")
    val title : String="default_title",
    @ColumnInfo("Description")
    val description : String="default_description"
)
