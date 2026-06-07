package com.example.navigationsample

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SecondScreen(name:String ,navigateToFirstScreen : () -> Unit,modifier: Modifier = Modifier) {

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "This is my second screen",
            fontSize = 24.sp,
            modifier= Modifier.padding(8.dp)
        )
        Text("Welcome to the second screen" , fontSize = 24.sp)
        Button(
            onClick = {
                navigateToFirstScreen()
            }
        ) {
            Text("Click me to go to next Screen")
        }

    }
}


@Preview(showBackground = true)
@Composable
private fun SecondScreenPreview() {
    SecondScreen("Atul",{})
}