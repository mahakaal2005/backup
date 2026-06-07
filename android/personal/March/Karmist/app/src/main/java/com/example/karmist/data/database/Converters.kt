package com.example.karmist.data.database

import androidx.room.TypeConverter
import com.example.karmist.data.model.KarmSource

@Suppress("unused")
class Converters {

    @TypeConverter
    fun fromKarmSource(source: KarmSource): String = source.name

    @TypeConverter
    fun toKarmSource(value: String): KarmSource = KarmSource.valueOf(value)
}
