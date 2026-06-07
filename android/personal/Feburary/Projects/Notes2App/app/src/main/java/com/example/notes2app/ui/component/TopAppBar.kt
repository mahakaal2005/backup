package com.example.notes2app.ui.component

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarColors
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import com.example.notes2app.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopAppBar(
    title : String = "Home Screen",
    onBackIconClicked : () -> Unit,
    modifier: Modifier = Modifier
) {
     CenterAlignedTopAppBar(
        title = {
            Text(text = title)
        },
         navigationIcon = {
             if(title != "Home Screen"){
                 IconButton(
                     onClick = {
                         onBackIconClicked()
                     }
                 ) {
                     Icon(
                         imageVector = Icons.AutoMirrored.Default.ArrowBack,
                         contentDescription = null
                     )
                 }
             }else{
                 null
             }
         },
         colors = TopAppBarDefaults.topAppBarColors(
             containerColor = Color.Red
         )
    )
}