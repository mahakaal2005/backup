package com.example.navigationsample

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun FirstScreen(navigateToSecondScreen: (String)->Unit ,modifier: Modifier = Modifier) {
    val name = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "This is my first screen",
            fontSize = 24.sp,
            modifier= Modifier.padding(8.dp)
        )
        OutlinedTextField(
            value = name.value,
            onValueChange = {name.value=it},
            modifier = Modifier.padding(8.dp)
        )
        Button(
            onClick = {
                navigateToSecondScreen(name.value)
            }
        ) {
            Text("Click me to go to next Screen")
        }

    }
}


@Preview(showBackground = true)
@Composable
private fun FirstScreenPreview() {
    FirstScreen({})
}