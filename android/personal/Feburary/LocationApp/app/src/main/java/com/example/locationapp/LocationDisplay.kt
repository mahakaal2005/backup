package com.example.locationapp

import android.Manifest
import android.app.Activity
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModel

@Composable
fun LocationDisplay(locationViewModel : LocationViewModel,modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val location = locationViewModel.location.value
    val address = location?.let{
        LocationUtils(context.applicationContext).reverseGeolocation(location)
    }


    val requestPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
        onResult={ permissions->
            if(permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
                && permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true){
                //I have access to permission

            }else{
                //I need to ask for permission
                val rationaleRequired = ActivityCompat.shouldShowRequestPermissionRationale(
                    context as Activity,
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) ||
                        ActivityCompat.shouldShowRequestPermissionRationale(
                            context as Activity,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        )

                if(rationaleRequired){
                    Toast.makeText(context,
                        "Permission dede...",
                        Toast.LENGTH_SHORT).show()
                } else{
                    Toast.makeText(context,
                        "Ab ni luga setting me jake dee",
                        Toast.LENGTH_SHORT).show()
                }
            }
        })


    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxSize()
    ) {
        when{
            locationViewModel.location.value == null ->Text("Location Not Found")
            else -> Text(address.toString())
        }
        Button(onClick = {
            if(LocationUtils(context.applicationContext).hasLocationPermission()){
                //Get the location
                LocationUtils(context.applicationContext).requestLocationUpdates(locationViewModel)
            }else{
                //Give the popup to ask for location permission
                requestPermissionLauncher.launch(
                    arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    )
                )
            }
        }) {
            Text("Find the latest location")
        }
    }
}