package com.example.myrecepieapp

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET

val retrofit = Retrofit.Builder().baseUrl("https://www.themealdb.com/api/json/v1/1/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val recepieService = retrofit.create(ApiService::class.java)


interface ApiService {
    @GET("categories.php")
    suspend fun getCategories() : CategoriesResponse
}

