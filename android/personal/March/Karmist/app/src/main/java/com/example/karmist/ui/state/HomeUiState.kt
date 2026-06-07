package com.example.karmist.ui.state

import com.example.karmist.data.entity.Karm

sealed interface HomeUiState {
    data object Loading : HomeUiState
    data object Empty : HomeUiState
    data object EmptyFiltered : HomeUiState
    data class Success(
        val karms: List<Karm>,
        val syncedAt : Long?
    ) : HomeUiState
    data class Error(val message : String) : HomeUiState
}