package com.example.mywishlistapp

import android.graphics.drawable.Icon
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.DismissDirection
import androidx.compose.material.DismissState
import androidx.compose.material.DismissValue
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.FractionalThreshold
import androidx.compose.material.SwipeToDismiss
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.rememberDismissState
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mywishlistapp.data.DummyWishData
import com.example.mywishlistapp.viewmodel.WishViewModel

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun HomeView(
    viewModel: WishViewModel,
    navController: NavController,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = { AppBarView("WishList") },
        floatingActionButton = {
            FloatingActionButton(
                modifier = Modifier.padding(20.dp),
                contentColor = Color.White,
                containerColor = Color.Black,
                onClick = {
                    navController.navigate(Screen.AddScreen.route+"/0L")
                },
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,

                )
            }
        }
    ) {paddingValues ->
        val wishList = viewModel.getAllWishes.collectAsState(listOf())
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(paddingValues)
        ) {
            items(wishList.value, key = {it.id}){wish->

                val dismissState = rememberDismissState (
                    confirmStateChange = {
                        if(it == DismissValue.DismissedToEnd || it == DismissValue.DismissedToStart ){
                                viewModel.deleteAWish(wish)
                        }
                        true
                    }
                )

                SwipeToDismiss(
                    state = dismissState,
                    directions = setOf(DismissDirection.EndToStart , DismissDirection.StartToEnd),
                    background = {
                        val color by animateColorAsState(
                            if( dismissState.dismissDirection == DismissDirection.EndToStart) Color.Red
                            else Color.Transparent
                        )
                        Box(
                            modifier = Modifier.fillMaxSize().background(color).padding(horizontal = 20.dp),
                            contentAlignment = Alignment.CenterEnd
                        ){
                            Icon(imageVector = Icons.Default.Delete , tint = Color.White , contentDescription = "")
                        }
                    },
                    dismissThresholds = { FractionalThreshold(0.3f)},
                    dismissContent = {
                        WishItem(wish,{
                            val id = wish.id
                            navController.navigate(Screen.AddScreen.route + "/$id")
                        })
                    }
                )
            }
        }
    }
}