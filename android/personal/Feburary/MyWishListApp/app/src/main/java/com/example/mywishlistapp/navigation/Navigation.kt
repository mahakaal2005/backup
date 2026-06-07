package com.example.mywishlistapp.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.mywishlistapp.AddEditDetailView
import com.example.mywishlistapp.HomeView
import com.example.mywishlistapp.Screen
import com.example.mywishlistapp.viewmodel.WishViewModel

@Composable
fun Navigation(
    viewModel : WishViewModel = viewModel(),
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.HomeScreen.route
    ){
        composable(Screen.HomeScreen.route){
            HomeView(viewModel,navController)
        }
        composable(Screen.AddScreen.route + "/{id}",
            arguments = listOf(
                navArgument("id"){
                    type = NavType.LongType
                    defaultValue = 0L
                    nullable = false
                }
            )
        ){
            val id = it.arguments?.getLong("id") ?: 0L
            AddEditDetailView(id,viewModel ,navController)
        }
    }
}