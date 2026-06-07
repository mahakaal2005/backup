package com.example.notes2app.ui.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun NoteItem(
    title : String,
    description : String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier.padding(8.dp),
        elevation = CardDefaults.cardElevation(3.dp),
    )  {
        Column(
            modifier.fillMaxWidth()
                .background(color = Color.White)
                .padding(16.dp)
        ) {
            Text(
                text = title,
                style = TextStyle(
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp
                )
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = description,
                style = TextStyle(
                    fontWeight = FontWeight.W400,
                    fontSize = 16.sp
                )
            )
        }
    }
}


