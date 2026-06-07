package com.example.karmist.navigation

sealed class Screen( val route : String) {
    object HomeScreen : Screen("home_screen")

    object KarmScreen : Screen("karm_screen")
}