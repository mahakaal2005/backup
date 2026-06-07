package com.example.notes2app.data.remote.dto

data class TodoDto(
    val userId:Int,
    val id:Long,
    val title:String,
    val completed: Boolean
)