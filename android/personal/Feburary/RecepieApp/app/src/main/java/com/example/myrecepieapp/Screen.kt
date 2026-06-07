package com.example.myrecepieapp

sealed class Screen(val route: String) {
    object RecepieScreen : Screen("recepiescreen")
    object DetailScreen : Screen("detailscreen")
}