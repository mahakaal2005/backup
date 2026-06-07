package com.example.myrecepieapp


import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberAsyncImagePainter

@Composable
fun RecepieScreen(
    onCategoryClick:(Category)-> Unit
){
    val recepieViewModel: MainViewModel = viewModel()
    val viewState by recepieViewModel.categoriesState

    Box(modifier = Modifier.fillMaxSize()){
        when {
            viewState.loading ->{
                CircularProgressIndicator(modifier = Modifier.align(alignment = Alignment.Center))
            }
            viewState.error != null ->{
                Text("Error Occured")
            }
            else ->{
                //Display Categories
                CategoryScreen(viewState.list,onCategoryClick)
            }
        }
    }
}


@Composable
fun CategoryScreen(categories : List<Category>,onCategoryClick:(Category)-> Unit, modifier: Modifier = Modifier) {
    LazyVerticalGrid(
        GridCells.Fixed(2),
        modifier = Modifier.fillMaxSize()
    ) {
        items(categories) {
            category ->
            Category(category, onCategoryClick)
        }
    }
}


@Composable
fun Category(category : Category, onCategoryClick:(Category)-> Unit, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier  = Modifier
            .fillMaxSize()
            .padding(8.dp)
            .aspectRatio(1f)
            .clickable(enabled = true, onClick = { onCategoryClick(category) })
    ){
        Image(
            painter = rememberAsyncImagePainter(category.strCategoryThumb),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(0.7f)
        )

        Text(text = category.strCategory,
            style = TextStyle(fontWeight= FontWeight.Bold),
            color = Color.Black,
            modifier= Modifier.padding(top = 16.dp)
            )
    }
}