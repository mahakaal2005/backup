package com.example.karmist.data.repository

import com.example.karmist.data.dao.KarmDao
import com.example.karmist.data.entity.Karm
import com.example.karmist.data.mapper.toKarm
import com.example.karmist.data.model.FilterType
import com.example.karmist.data.remote.TodoApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withTimeout
import javax.inject.Inject

class KarmRepository @Inject constructor(
    private val karmDao: KarmDao,
    private val todoApi: TodoApi
) {

    suspend fun insertKarm(karm: Karm){
        karmDao.insertKarm(karm)
    }

    suspend fun updateKarm(karm: Karm){
        karmDao.updateKarm(karm)
    }

    suspend fun deleteKarm(karm: Karm){
        karmDao.deleteKarm(karm)
    }

    fun getAllKarms() : Flow<List<Karm>>{
        return karmDao.getAllKarms()
    }

    fun getFilteredKarms(query: String, filterType: FilterType): Flow<List<Karm>> {
        return karmDao.getFilteredKarms(
            query = query,
            filter = filterType.name
        )
    }

    fun getKarmById(id: Long) : Flow<Karm?>{
        return karmDao.getKarmById(id)
    }

    suspend fun refreshFromApi(){
        // Keep local notes intact and only upsert remote rows with a timeout guard.
        withTimeout(10_000) {
            val remoteTodos = todoApi.getTodos()
            val mapped = remoteTodos.mapNotNull { it.toKarm() }
            karmDao.insertAllKarms(mapped)
        }
    }

}