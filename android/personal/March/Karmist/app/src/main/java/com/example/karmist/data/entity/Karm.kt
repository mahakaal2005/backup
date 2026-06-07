package com.example.karmist.data.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.example.karmist.data.model.KarmSource

@Entity(
    tableName = "karms_table",
    indices = [
        Index(value = ["Description"]),
        Index(value = ["Source"])
    ]
)
data class Karm(
    @PrimaryKey(autoGenerate = true)
    val id: Long =0L,
    @ColumnInfo("Description")
    val description : String ="",
    @ColumnInfo("Completion_Status")
    val completed : Boolean = false,
    @ColumnInfo("Date")
    val date : Long = 0L,
    @ColumnInfo("Source")
    val source: KarmSource = KarmSource.LOCAL
)
