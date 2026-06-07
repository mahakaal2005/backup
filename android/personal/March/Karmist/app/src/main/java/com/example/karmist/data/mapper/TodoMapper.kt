package com.example.karmist.data.mapper

import com.example.karmist.data.entity.Karm
import com.example.karmist.data.model.KarmSource
import com.example.karmist.data.remote.TodoDto

fun TodoDto.toKarm(now: Long = System.currentTimeMillis()): Karm? {
    val remoteId = id ?: return null
    if (remoteId <= 0L) return null

    return Karm(
        id = -remoteId, // negative ids reserved for remote rows
        description = title?.trim().orEmpty(),
        completed = completed ?: false,
        date = now,
        source = KarmSource.REMOTE
    )
}