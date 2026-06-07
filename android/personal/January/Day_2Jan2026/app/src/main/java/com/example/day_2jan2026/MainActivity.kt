package com.example.day_2jan2026

import android.content.res.Configuration
import android.os.Bundle
import android.provider.Telephony
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.basicMarquee
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.dropShadow
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.example.day_2jan2026.ui.theme.Day_2Jan2026Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val windowInsetsController =
            WindowCompat.getInsetsController(window,window.decorView)

        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())

        setContent {
            Day_2Jan2026Theme(){
                Surface(modifier = Modifier.fillMaxSize()
                    .padding(all =10.dp)
                ) {
                    Conversations(SampleData.conversationSample)
                }
            }
        }
    }
}

@Composable
fun MessageCard(msg : Message){
    Row (modifier = Modifier.padding(all = 10.dp)){
        Image(
            painter = painterResource(R.drawable.img),
            contentDescription = "THis is profile photo",
            modifier = Modifier.size(50.dp)
                .clip(shape = CircleShape)
                .border(border = BorderStroke(width= 3.dp , color = MaterialTheme.colorScheme.primaryContainer), shape = CircleShape)
        )
        Spacer(modifier = Modifier.width(10.dp))

        var isExpanded by remember { mutableStateOf(false) }

        val surfaceColor by animateColorAsState(
            if(isExpanded) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface
        )

        Surface(
            shape = MaterialTheme.shapes.extraLarge, shadowElevation = 10.dp,
            color = surfaceColor,
            modifier = Modifier.animateContentSize().padding(1.dp)
        ) {
            Column(
                modifier = Modifier.padding(all =10.dp)
                    .clickable{isExpanded = !isExpanded},
            ) {
                Text(
                    text = msg.title,
                    style = MaterialTheme.typography.titleLarge,
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = msg.message,
                    maxLines = if (isExpanded) Int.MAX_VALUE else 1,
                    modifier = Modifier.padding(start = 10.dp)
                )
            }
        }
    }
}

@Composable
fun Conversations(messageList : List<Message>){
    LazyColumn {
        items(messageList) {
            message ->MessageCard(message)
        }
    }
}

@Preview
@Composable
fun ConversationsPreview(){
    Day_2Jan2026Theme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Conversations(SampleData.conversationSample)
        }
    }
}

@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES
)
@Composable
fun ConversationsPreviewDark(){
    Day_2Jan2026Theme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Conversations(SampleData.conversationSample)
        }
    }
}