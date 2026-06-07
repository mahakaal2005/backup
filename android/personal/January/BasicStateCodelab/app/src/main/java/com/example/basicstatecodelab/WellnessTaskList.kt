package com.example.basicstatecodelab

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier


@Composable
fun WellnessTasksList(
    list: List<WellnessTask>,
    onCloseTask: (WellnessTask) ->Unit,
    onCheckedTask : (WellnessTask, Boolean) ->Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier,

    ) {
        items(
            items = list,
            key = { task -> task.id },
        ){ task ->
            var checked by rememberSaveable { mutableStateOf(false) }
            WellnessTaskItem(
                taskName = task.label,
                onClose = { onCloseTask(task) },
                checked = task.checked,
                onCheckedChange = { checked -> onCheckedTask(task,checked) }
            )
        }
    }
}

