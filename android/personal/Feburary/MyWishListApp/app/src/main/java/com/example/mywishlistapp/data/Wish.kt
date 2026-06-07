package com.example.mywishlistapp.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "wish-table")
data class Wish(
    @PrimaryKey(autoGenerate = true)
    val id : Long = 0L,
    @ColumnInfo(name = "wish-title")
    val title : String="",
    @ColumnInfo(name = "wish-desc")
    val description : String =""
)


object DummyWishData {

    val wishList = listOf(
        Wish(
            id = 1L,
            title = "Buy a New Laptop",
            description = "Save money and purchase a high-performance laptop for development and gaming."
        ),
        Wish(
            id = 2L,
            title = "Start Fitness Routine",
            description = "Follow a consistent workout plan and maintain a healthy diet."
        ),
        Wish(
            id = 3L,
            title = "Build a Personal Portfolio",
            description = "Create a professional portfolio website to showcase projects."
        ),
        Wish(
            id = 4L,
            title = "Master Jetpack Compose",
            description = "Deeply understand state, navigation, and performance optimization."
        ),
        Wish(
            id = 5L,
            title = "Launch a Side Project",
            description = "Develop and publish an app that generates passive income."
        ),
        Wish(
            id = 6L,
            title = "Improve Public Speaking",
            description = "Practice confident communication and technical presentations."
        ),
        Wish(
            id = 7L,
            title = "Contribute to Open Source",
            description = "Actively contribute to Android or backend repositories."
        ),
        Wish(
            id = 8L,
            title = "Learn Spring Boot Deeply",
            description = "Understand REST APIs, security, JPA, and clean architecture."
        ),
        Wish(
            id = 9L,
            title = "Travel to the Mountains",
            description = "Plan a peaceful trip to refresh mentally and physically."
        ),
        Wish(
            id = 10L,
            title = "Achieve Financial Growth",
            description = "Build multiple income streams using tech skills."
        )
    )
}