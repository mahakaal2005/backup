package com.example.notes2app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.notes2app.ui.screen.HomeScreen
import com.example.notes2app.ui.screen.NotesAddEditScreen
import com.example.notes2app.viewmodel.NotesViewmodel


@Composable
fun Navigation(
    viewmodel: NotesViewmodel = NotesViewmodel(),
    navController: NavHostController = rememberNavController(),
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Screen.HomeScreen.route
    ){
        composable(Screen.HomeScreen.route) {
            HomeScreen(viewModel = viewmodel , navController)
        }

        composable(
            route = Screen.NoteAddEditScreen.route + "/{id}",
            arguments = listOf(
                navArgument(name = "id"){
                    type = NavType.LongType
                    defaultValue= 0L
                    nullable  = false
                }
            )
        ) {
            val id = it.arguments?.getLong("id") ?: 0L
            NotesAddEditScreen(id,viewmodel,navController)
        }
    }
}