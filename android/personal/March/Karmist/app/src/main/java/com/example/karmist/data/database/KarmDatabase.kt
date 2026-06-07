package com.example.karmist.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import androidx.room.migration.Migration
import com.example.karmist.data.dao.KarmDao
import com.example.karmist.data.entity.Karm

@Database(
    version = 2,
    entities = [Karm::class],
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class KarmDatabase : RoomDatabase(){

    abstract fun karmDao() : KarmDao

    companion object {
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE karms_table ADD COLUMN Source TEXT NOT NULL DEFAULT 'LOCAL'")
                db.execSQL("UPDATE karms_table SET Source = 'REMOTE' WHERE id < 0")
                db.execSQL("CREATE INDEX IF NOT EXISTS index_karms_table_Description ON karms_table(Description)")
                db.execSQL("CREATE INDEX IF NOT EXISTS index_karms_table_Source ON karms_table(Source)")
            }
        }
    }

}