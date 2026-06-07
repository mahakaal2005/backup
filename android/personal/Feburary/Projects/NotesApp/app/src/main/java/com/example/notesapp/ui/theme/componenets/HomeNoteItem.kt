package com.example.notesapp.ui.theme.componenets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.notesapp.data.entity.Note
import com.example.notesapp.viewmodels.NotesViewModel

@Composable
fun HomeNoteItem(
    note: Note,
    onNoteCLicked : () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = CardDefaults.outlinedShape,
        colors = CardDefaults.cardColors(),
        elevation = CardDefaults.cardElevation(3.dp,5.dp),
        modifier = Modifier.fillMaxWidth()
            .clickable(enabled = true, onClick = { onNoteCLicked() })
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(4.dp)
        ) {
            Text(
                text = note.title,
                style = TextStyle(
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = note.description,
                style = TextStyle(
                    fontWeight = FontWeight.Normal,
                    fontSize = 12.sp
                )
            )
        }
    }
}
