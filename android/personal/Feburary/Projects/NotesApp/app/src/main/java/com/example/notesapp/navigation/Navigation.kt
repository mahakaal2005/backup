package com.example.notesapp.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.notesapp.ui.theme.screens.HomeScreen
import com.example.notesapp.ui.theme.screens.NoteAddEditScreen
import com.example.notesapp.viewmodels.NotesViewModel

@Composable
fun Navigation(
    viewModel: NotesViewModel = viewModel(),
    navController : NavHostController = rememberNavController(),
    modifier: Modifier = Modifier
) {


    NavHost(
        navController = navController,
        startDestination = Screen.HomeScreen.route
    ) {
        composable(Screen.HomeScreen.route) {
            HomeScreen(viewModel = viewModel, navController = navController)
        }

        composable(Screen.NoteAddEditScreen.route + "/{id}",
            arguments = listOf(
                navArgument("id"){
                    type= NavType.LongType
                    defaultValue=0L
                    nullable = false
                }
            )
        ) {
            val id = it.arguments?.getLong("id") ?: 0L
            NoteAddEditScreen(id,viewModel = viewModel , navController = navController)
        }
    }
}