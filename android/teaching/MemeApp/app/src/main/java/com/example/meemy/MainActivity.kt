package com.example.meemy

import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class MainActivity : AppCompatActivity() {

    private lateinit var memeImageView: ImageView
    private lateinit var nextButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Initialize views
        memeImageView = findViewById(R.id.myMeme)
        nextButton = findViewById(R.id.btnNext)

        // Load initial meme
        loadMeme()

        // Set click listener to refresh meme
        nextButton.setOnClickListener {
            loadMeme()
        }
    }

    private fun loadMeme() {
        // Create Retrofit instance
        val retrofit = Retrofit.Builder()
            .baseUrl("https://meme-api.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        // Create the API service
        val service = retrofit.create(MemeApiService::class.java)

        // Make the network call
        service.getMeme().enqueue(object : Callback<Meme> {
            override fun onResponse(call: Call<Meme>, response: Response<Meme>) {
                if (response.isSuccessful && response.body() != null) {
                    val memeUrl = response.body()!!.url

                    // Use Glide to load the image into the ImageView
                    Glide.with(this@MainActivity)
                        .load(memeUrl)
                        .placeholder(R.drawable.ic_launcher_background) // Placeholder while loading
                        .into(memeImageView)
                }
            }

            override fun onFailure(call: Call<Meme>, t: Throwable) {
                // Handle failure
                Toast.makeText(
                    this@MainActivity,
                    "Failed to load meme: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }
}

