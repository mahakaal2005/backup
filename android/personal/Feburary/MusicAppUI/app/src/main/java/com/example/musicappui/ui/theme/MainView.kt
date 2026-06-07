package com.example.musicappui.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier


@Composable
fun MainView(modifier: Modifier = Modifier) {

    val scaffoldState = rememberScaffoldState()

    Scaffold(


    ) {
        Text("Hello", Modifier.padding(it))
    }
}
