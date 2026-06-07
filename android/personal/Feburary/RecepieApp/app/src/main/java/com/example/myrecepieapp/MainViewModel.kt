package com.example.myrecepieapp

import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.State
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import okhttp3.internal.connection.Exchange

class MainViewModel : ViewModel(){

    private val _categoryState= mutableStateOf(RecepieState())
    val categoriesState : State<RecepieState> =_categoryState

    init {
        fetchCategories()
    }

    private fun fetchCategories(){
        viewModelScope.launch {
            try {
                val response = recepieService.getCategories()
                _categoryState.value= _categoryState.value.copy(
                    loading = false,
                    list = response.categories,
                    error = null
                )
            }catch (e: Exception){
                _categoryState.value=_categoryState.value.copy(
                    loading = false,
                    error = "Error fetching categories : ${e.message}"
                )
            }
        }
    }


    data class RecepieState(
        val loading : Boolean =true,
        val list: List<Category> = emptyList(),
        val error : String? =null
    )
}