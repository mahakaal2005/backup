package com.example.notes2app.navigation

sealed class Screen( val route : String) {
    object HomeScreen : Screen("home_screen")
    object NoteAddEditScreen : Screen("note_add_edit_screen")
}