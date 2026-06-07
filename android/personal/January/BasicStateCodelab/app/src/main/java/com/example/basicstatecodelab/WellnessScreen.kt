package com.example.basicstatecodelab

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun WellnessScreen(
    modifier: Modifier = Modifier,
    WellnwessViewModel : WellnessViewModel = viewModel()
) {
    Column(modifier = modifier) {
        WaterCounter()
        WellnessTasksList(
            list = WellnwessViewModel.tasks,
            onCloseTask = { task ->
                WellnwessViewModel.remove(task)
            },
            onCheckedTask = { task, checked ->
                WellnwessViewModel.checkTaskChanged(task, checked)
            },
        )
    }
}




