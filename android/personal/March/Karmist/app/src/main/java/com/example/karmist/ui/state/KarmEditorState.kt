package com.example.karmist.ui.state

import com.example.karmist.data.model.KarmSource

data class KarmEditorState(
    val id: Long = 0L,
    val description: String = "",
    val completed: Boolean = false,
    val date: Long = 0L,
    val source: KarmSource = KarmSource.LOCAL
)

