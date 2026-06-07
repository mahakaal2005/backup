package com.example.karmist.data.remote

import retrofit2.http.GET

interface TodoApi{
    @GET("todos")
    suspend fun getTodos():List<TodoDto>
}