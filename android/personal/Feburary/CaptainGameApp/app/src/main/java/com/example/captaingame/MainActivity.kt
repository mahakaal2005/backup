package com.example.captaingame

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.captaingame.ui.theme.CaptainGameTheme
import java.util.Random

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CaptainGameTheme {
                Surface (modifier = Modifier.fillMaxSize()) {
                    Sail()
                }
            }
        }
    }
}

@Composable
fun Sail(modifier: Modifier = Modifier) {
    Column(
        modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        val treasuresFound = remember { mutableStateOf(0) }
        val direction= remember {mutableStateOf("North") }
        val stormOrTreasure= remember { mutableStateOf("") }
        Text(text = "Treasures Found : ${treasuresFound.value}")
        Spacer(Modifier.height(16.dp))
        Text(text = "Current Sailing Direction : ${direction.value}")
        Spacer(Modifier.height(16.dp))
        Text(text = "${stormOrTreasure.value}")
        Spacer(Modifier.height(16.dp))
        Button(onClick = {
            direction.value="South"
            if(Random().nextBoolean()){
                treasuresFound.value++
                stormOrTreasure.value="Treasure"
            }else{
                stormOrTreasure.value="Storm"
            }
        }) {
            Text("South")
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = {
            direction.value="North"
            if(Random().nextBoolean()){
                treasuresFound.value++
                stormOrTreasure.value="Treasure"
            }else{
                stormOrTreasure.value="Storm"
            }
        }) {
            Text("North")
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = {
            direction.value="West"
            if(Random().nextBoolean()){
                treasuresFound.value++
                stormOrTreasure.value="Treasure"
            }else{
                stormOrTreasure.value="Storm"
            }
        }) {
            Text("West")
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = {
            direction.value="East"
            if(Random().nextBoolean()){
                treasuresFound.value++
                stormOrTreasure.value="Treasure"
            }else{
                stormOrTreasure.value="Storm"
            }
        }) {
            Text("East")
        }
    }
}


@Preview(
    showBackground = true,
    showSystemUi = true
)
@Composable
private fun SailPreview() {
    Sail()
}