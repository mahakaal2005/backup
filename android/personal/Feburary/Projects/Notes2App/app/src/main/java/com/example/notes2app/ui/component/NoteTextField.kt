package com.example.notes2app.ui.component

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun NoteTextField(
    label: String = "Dummy label",
    value: String = " This is dummy data ",
    singleLine : Boolean = true,
    onValueChanged : (String) -> Unit ={},
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChanged,
        label = { Text(text = label) },
        placeholder = { Text("Enter $label") },
        singleLine = singleLine,
        colors = TextFieldDefaults.colors(
            focusedTextColor = Color.Black,
            unfocusedTextColor = Color.Black,
            focusedContainerColor = Color.White,
            unfocusedLabelColor = Color.Black,
            focusedLabelColor = Color.Black,
            unfocusedContainerColor = Color.White,
        ),
        modifier = modifier.padding(8.dp)
    )
}


@Preview(showBackground = true)
@Composable
private fun NotesTextFieldPreview() {
    NoteTextField()
}