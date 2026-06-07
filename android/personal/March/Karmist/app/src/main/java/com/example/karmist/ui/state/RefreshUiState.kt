package com.example.karmist.ui.state

sealed interface RefreshUiState {
    data object Idle : RefreshUiState
    data object Loading : RefreshUiState
    data class Success(val syncedAtMillis : Long): RefreshUiState
    data class Error(val message :String): RefreshUiState
}
