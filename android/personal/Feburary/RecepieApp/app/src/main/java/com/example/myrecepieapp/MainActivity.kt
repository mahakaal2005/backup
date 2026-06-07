package com.example.myrecepieapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.myrecepieapp.ui.theme.MyRecepieAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyRecepieAppTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    MyApp()
                }
            }
        }
    }
}

@Composable
fun MyApp(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    NavHost(navController=navController, startDestination = Screen.RecepieScreen.route){
        composable(route = Screen.RecepieScreen.route){
            RecepieScreen {category ->
                navController.navigate("${Screen.DetailScreen.route}/${category.idCategory}")
            }
        }
        composable(route= "${Screen.DetailScreen.route}/{categoryId}"){ backStackEntry ->
            val categoryId= backStackEntry.arguments?.getString("categoryId")?:""
            CategoryDetailScreen(categoryId)
        }
    }
}