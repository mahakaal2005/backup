package com.example.myshoppinglist

import android.util.Log
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class LocationViewModel : ViewModel() {
    private var _location = mutableStateOf<LocationData?>(null)
    var location : State<LocationData?> = _location

    private var _address = mutableStateOf<List<GeocodingResult>>(emptyList())
    var address : State<List<GeocodingResult>> =_address

    fun updateLocation( newLocation : LocationData){
        _location.value = newLocation
        fetchLocation("${newLocation.latitude},${newLocation.longitude}")
    }

    fun fetchLocation(latlng : String){
        try {
            viewModelScope.launch {
                var result = RetrofitClient.create().addressFromCoordinates(
                    latlng,
                    "AIzaSyBywq3eRNNA9OfXcILGc2tfn2spHL0hvJ8"
                )
                _address.value = result.results
            }
        }catch (e: Exception){
            Log.d("Res1","${e.cause} :: ${e.message}")
        }
    }
}