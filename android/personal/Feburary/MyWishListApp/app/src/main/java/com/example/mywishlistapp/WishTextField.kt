package com.example.mywishlistapp

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.OutlinedTextField
import androidx.compose.material.Text
import androidx.compose.material.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Composable
fun WishTextField(
    label: String,
    value : String,
    onValueChanged : (String) -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = value ,
        onValueChange = onValueChanged,
        label = { Text(label , color = Color.Black) },
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        keyboardOptions = KeyboardOptions( keyboardType = KeyboardType.Text ),
        colors = TextFieldDefaults.outlinedTextFieldColors(
            textColor = Color.Black,
            focusedBorderColor = Color.Black,
            unfocusedBorderColor = Color.Black,
            focusedLabelColor = Color.Black,
            unfocusedLabelColor = Color.Black
        )
    )
}

@Preview(showBackground = true)
@Composable
private fun WishTextFieldPrev() {
    WishTextField("Label" ,"Value",{})
}