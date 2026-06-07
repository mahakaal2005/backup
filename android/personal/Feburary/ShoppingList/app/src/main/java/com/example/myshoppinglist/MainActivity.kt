package com.example.myshoppinglist

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.dialog
import androidx.navigation.compose.rememberNavController
import com.example.myshoppinglist.ui.theme.MyShoppingListTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyShoppingListTheme {
                Navigation()
            }
        }
    }
}

@Composable
fun Navigation() {
    val navController = rememberNavController()
    val locationViewModel : LocationViewModel = viewModel()
    val context = LocalContext.current
    val locationUtils = LocationUtils(context)

    NavHost (navController,startDestination="shoppinglistscreen"){
        composable("shoppinglistscreen") {
            ShoppingListApp(
                locationUtils = locationUtils,
                locationViewModel = locationViewModel,
                navController = navController
            )
        }

        dialog("locationscreen") {
            locationViewModel.location.value?.let{it1->
                LocationSelectionScreen(location = it1, address = locationViewModel.address.value, onLocationSelected = {locationdata->
                    locationViewModel.updateLocation(locationdata)
                    navController.popBackStack()
                })
            }
        }
    }
}