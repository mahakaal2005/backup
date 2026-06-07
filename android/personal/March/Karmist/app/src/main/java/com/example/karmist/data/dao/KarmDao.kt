package com.example.karmist.data.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.karmist.data.entity.Karm
import kotlinx.coroutines.flow.Flow

@Dao
abstract class KarmDao {

    @Insert
    abstract suspend fun insertKarm(karm : Karm)

    @Update
    abstract suspend fun updateKarm(karm: Karm)

    @Delete
    abstract suspend fun deleteKarm(karm: Karm)

    @Query("Select * from `karms_table`")
    abstract  fun getAllKarms() : Flow<List<Karm>>

    @Query(
        """
        SELECT * FROM `karms_table`
        WHERE `Description` LIKE '%' || :query || '%' COLLATE NOCASE
          AND (
              :filter = 'ALL'
              OR (:filter = 'COMPLETED' AND `Completion_Status` = 1)
              OR (:filter = 'PENDING' AND `Completion_Status` = 0)
          )
        ORDER BY `Date` DESC
        """
    )
    abstract fun getFilteredKarms(query: String, filter: String): Flow<List<Karm>>

    @Query("Select * from `karms_table` where id=:id")
    abstract fun getKarmById(id: Long) : Flow<Karm?>

    @Query("SELECT COUNT(*) FROM `karms_table`")
    abstract suspend fun getKarmCount(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    abstract suspend fun insertAllKarms(karms : List<Karm>)

    @Query("Delete from `karms_table`")
    abstract suspend fun clearAllKarms()
}