package com.example.notesapp.navigation

sealed class Screen (val route:String) {
    object HomeScreen: Screen("home_screen")
    object NoteAddEditScreen: Screen(route ="note_add_screen")
}