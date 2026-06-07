package com.example.karmist.ui.state

sealed interface EditKarmUiState {
    data object Idle : EditKarmUiState
    data object Loading : EditKarmUiState
    data class Success(val editor: KarmEditorState) : EditKarmUiState
    data class Error(val message : String) : EditKarmUiState
}