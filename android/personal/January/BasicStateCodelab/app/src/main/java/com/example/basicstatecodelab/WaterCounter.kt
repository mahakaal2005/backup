package com.example.basicstatecodelab


import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp


@Composable
fun WaterCounter(
    modifier: Modifier = Modifier,
){
    StatefulCounter()
}

@Composable
fun StatefulCounter(
){
    var count by rememberSaveable { mutableIntStateOf(0) }
    StatelessCounter(count , onIncrement = {count++})
}


@Composable
fun StatelessCounter(
    count : Int,
    onIncrement : () -> Unit,
){
    Column(modifier = Modifier.padding(16.dp))  {
        if(count > 0){
            Text(
                text = "You have had $count glasses"
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth()
                .padding(top=10.dp),
            horizontalArrangement = Arrangement.Center
        ){
            Button(
                onClick = {
                    onIncrement()
                },
                enabled = count<10
            ) {
                Text("Add one")
            }
        }
    }
}