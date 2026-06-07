package com.example.myshoppinglist

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

data class ShoppingItem(
    val id: Int, val name: String, val quantity: Int, val isEditing: Boolean = false,val address: String =""
)

@SuppressLint("MissingPermission")
@Composable
fun ShoppingListApp(
    locationUtils: LocationUtils,
    locationViewModel: LocationViewModel,
    navController: NavController,
    modifier: Modifier = Modifier
) {
    var sItems by remember { mutableStateOf(listOf<ShoppingItem>()) }
    var showDailogue by remember { mutableStateOf(false) }
    var itemName by remember { mutableStateOf("") }
    var itemQuantity by remember { mutableStateOf("") }

    val requestPermissionLauncher = requestPermissionLauncher(context = locationUtils.context)

    Surface(modifier = Modifier.fillMaxSize()) {
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(16.dp)
        ) {
            Button(
                onClick = { showDailogue = true }) {
                Text("Add Item")
            }
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(items = sItems,key ={it.id}) { item ->
                    if (item.isEditing) {
                        ShopingListItemEditor(item, onEditComplete = { editedName, editedQuantity ->
                            sItems = sItems.map {
                                when {
                                    (it.id == item.id) -> {
                                        it.copy(
                                            name = editedName,
                                            quantity = editedQuantity,
                                            isEditing = false,
                                            address = locationViewModel.address.value.firstOrNull()?.formatted_address ?: ""
                                        )
                                    }
                                    it.isEditing -> {
                                        it.copy(isEditing = false)
                                    }
                                    else ->it
                                }
                            }
                        })
                    } else {
                        ShoppingListItem(item, {
                            //finding out which element is clicked and changing isEditing to true
                            sItems = sItems.map { it.copy(isEditing = it.id == item.id) }
                        }, {
                            sItems = sItems - item
                        })

                    }
                }
            }
        }
        if (showDailogue) {
            AlertDialog(onDismissRequest = { showDailogue = false }, confirmButton = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = {
                            val item = ShoppingItem(
                                id = sItems.size + 1,
                                name = itemName,
                                quantity = itemQuantity.toIntOrNull()?:1,
                                address = locationViewModel.address.value.first().formatted_address
                            )
                            sItems += item
                            itemName = ""
                            itemQuantity = ""
                            showDailogue = false
                        }) {
                        Text("Add")
                    }
                    Button(
                        onClick = { showDailogue = false }) {
                        Text("Cancel")
                    }
                }
            }, title = { Text("Add Items") }, text = {
                Column {
                    OutlinedTextField(
                        value = itemName,
                        onValueChange = { itemName = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp)
                    )
                    OutlinedTextField(
                        value = itemQuantity,
                        onValueChange = { itemQuantity = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp)
                    )
                    Button(
                        onClick = {
                            if (locationUtils.hasLocationPermission()){
                                locationUtils.requestLocationUpdates(locationViewModel)
                                navController.navigate("locationscreen"){
                                    this.launchSingleTop
                                }
                            }else{
                                requestPermissionLauncher.launch(arrayOf(
                                    android.Manifest.permission.ACCESS_FINE_LOCATION,
                                    android.Manifest.permission.ACCESS_COARSE_LOCATION
                                ))
                            }
                        }
                    ) {
                        Text("Address")
                    }
                }
            })
        }
    }
}