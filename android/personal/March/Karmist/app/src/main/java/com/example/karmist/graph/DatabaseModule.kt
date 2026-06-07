package com.example.karmist.graph

import android.content.Context
import androidx.room.Room
import com.example.karmist.data.dao.KarmDao
import com.example.karmist.data.database.KarmDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideKarmDatabase(
        @ApplicationContext context: Context
    ) : KarmDatabase{
        return Room.databaseBuilder(
            context,
            KarmDatabase::class.java,
            "karm_db"
        )
            .addMigrations(KarmDatabase.MIGRATION_1_2)
            .build()
    }

    @Provides
    fun provideKarmDao(database: KarmDatabase): KarmDao = database.karmDao()
}