package com.example.day_1jan2026

import android.content.res.Configuration
import android.graphics.Picture
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ModifierLocalBeyondBoundsLayout
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.day_1jan2026.ui.theme.Day1Jan2026Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Day1Jan2026Theme{
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Counter()
                }
            }
        }
    }
}

data class Message(val author:String,val message:String)

@Composable
fun MessageCard(msg : Message){
    Row(modifier = Modifier.padding(all = 50.dp)){
        Image(
            painter = painterResource(R.drawable.img),
            contentDescription = "This is sender's image",
            modifier = Modifier
                .size(50.dp)
                .clip(CircleShape)
                .border(5.dp, MaterialTheme.colorScheme.secondaryContainer,CircleShape)
        )

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.padding(start =5.dp)){
            Text(
                text ="Author : ${msg.author}",
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.titleLarge
            )
            Spacer(modifier = Modifier.height(5.dp))
            Surface(shape = MaterialTheme.shapes.extraLarge, shadowElevation = 10.dp) {
                Text(
                    text= "Message : ${msg.message}",
                    fontSize = 12.sp,
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(all = 15.dp),
                    )
            }
        }
    }
}

@Preview
@Composable
fun PreviewMessageCard(){
    Day1Jan2026Theme{
        Surface(modifier = Modifier.fillMaxSize()) {
            MessageCard(
                Message("Atul", "Hey there! Welcome to jetpack compose")
            )
        }
    }
}

@Preview(
    name = "Dark Mode",
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true
)
@Composable
fun PreviewMessageCardDark(){
    Day1Jan2026Theme{
        Surface(modifier = Modifier.fillMaxSize()){
            MessageCard(
                Message("Faiqua","Hello !! Mai aa gayi")
            )
        }
    }
}