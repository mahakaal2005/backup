package com.example.karmist.ui.state

data class HomeScreenState(
    val listState: HomeUiState = HomeUiState.Loading,
    val refreshState: RefreshUiState = RefreshUiState.Idle
)

