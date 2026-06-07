package com.example.myrecepieapp

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberAsyncImagePainter




@Composable
fun CategoryDetailScreen(categoryId: String,modifier: Modifier = Modifier) {

    val categoryViewModel : MainViewModel = viewModel()
    val viewState by categoryViewModel.categoriesState

    val category = viewState.list.find{it.idCategory == categoryId}?: Category("","","","")

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(top = 16.dp)
    ) {
        Text(
            text = category.strCategory,
            style = TextStyle(fontWeight = FontWeight.Bold),
            fontSize = 32.sp
        )
        Spacer(Modifier.width(16.dp))
        Image(
            painter = rememberAsyncImagePainter(category.strCategoryThumb),
            contentDescription = null,
            Modifier.wrapContentSize().padding(16.dp)
        )

        Spacer(Modifier.width(16.dp))
        Text(
            text = category.strCategoryDescription,
            style = TextStyle(fontWeight = FontWeight.Medium),
            textAlign = TextAlign.Justify,
            fontSize = 24.sp,
            modifier= Modifier.verticalScroll(rememberScrollState()).padding(8.dp)
        )
    }
}
