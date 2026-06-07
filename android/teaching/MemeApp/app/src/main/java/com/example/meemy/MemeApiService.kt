package com.example.meemy

import retrofit2.Call
import retrofit2.http.GET

/**
 * Interface to define the API endpoint.
 */
interface MemeApiService {
    // Defines a GET request to the "gimme" endpoint
    @GET("gimme")
    fun getMeme(): Call<Meme>
}
