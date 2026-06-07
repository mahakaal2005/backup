package com.example.notesapp.ui.theme.componenets

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun NotesTextField(
    label:String,
    value :String,
    onValueChanged : (String)-> Unit,
    singleLine : Boolean = true,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChanged,
        modifier = modifier
            .fillMaxWidth()
            .padding(8.dp),
        label = { Text(label) },
        placeholder = { Text("Enter $label") },
        singleLine = singleLine,
        colors = TextFieldDefaults.colors(
            focusedLabelColor = Color.Black,
            unfocusedLabelColor = Color.DarkGray,
            focusedTextColor = Color.Black,
            unfocusedTextColor = Color.Gray,
            unfocusedContainerColor = Color.Transparent,
            focusedIndicatorColor = Color.Black,
            unfocusedIndicatorColor = Color.DarkGray
        )
    )
}

@Preview(showBackground = true)
@Composable
private fun NotesTextFieldPreview() {
    NotesTextField(
        "Title",
        "This is preview",
        {}
    )
}