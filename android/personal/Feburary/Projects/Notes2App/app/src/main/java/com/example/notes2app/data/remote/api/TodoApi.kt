package com.example.notes2app.data.remote.api

import com.example.notes2app.data.remote.dto.TodoDto
import retrofit2.http.GET

interface TodoApi{

    @GET("todos")
    suspend fun getTodos() : List<TodoDto>
}