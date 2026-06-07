package com.example.karmist.navigation

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.karmist.ui.screens.HomeScreen
import com.example.karmist.ui.screens.KarmAddEditScreen
import com.example.karmist.viewmodel.KarmViewModel

@Composable
fun Navigation(
    navController: NavHostController = rememberNavController()
) {
    val viewModel: KarmViewModel = hiltViewModel()

    NavHost(
        navController = navController,
        startDestination = Screen.HomeScreen.route
    ){
        composable(Screen.HomeScreen.route){
            HomeScreen(viewModel , navController)
        }

        composable(
            route = Screen.KarmScreen.route + "/{id}",
            arguments = listOf(
                navArgument(name = "id") {
                    type = NavType.LongType
                    defaultValue = 0L
                    nullable = false
                }
            )
        ){
            val id = it.arguments?.getLong("id")?:0L
            KarmAddEditScreen(id = id,viewModel,navController)
        }
    }
}