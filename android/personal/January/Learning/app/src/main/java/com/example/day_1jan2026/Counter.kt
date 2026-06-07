package com.example.day_1jan2026

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

@Composable
fun Counter(
    modifier: Modifier = Modifier
){
    var count by remember { mutableStateOf(0) }
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
        )  {
        Button(
            onClick = {count++},
            enabled = true,
        ) {
            Text(text = "Clicked = $count")
        }
    }
}