package com.example.karmist.ui.event

import com.example.karmist.data.entity.Karm

sealed interface HomeUiEvent {
    data class ShowUndoDelete(val karm: Karm) : HomeUiEvent
}