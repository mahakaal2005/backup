package com.example.mywishlistapp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Card
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.mywishlistapp.data.Wish

@Composable
fun WishItem(
    wish : Wish,
    onClick : () -> Unit,
    modifier: Modifier = Modifier.padding(10.dp)
) {
    Card(
        elevation = 10.dp,
        backgroundColor = Color.White,
        modifier = Modifier.fillMaxWidth().padding(top=8.dp, start = 8.dp, end =  8.dp).clickable(
            onClick = {onClick()}
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(text = wish.title , fontWeight = FontWeight.ExtraBold)
            Text(text = wish.description)
        }
    }
}