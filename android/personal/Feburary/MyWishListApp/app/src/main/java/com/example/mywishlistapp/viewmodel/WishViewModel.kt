package com.example.mywishlistapp.viewmodel


import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mywishlistapp.Graph
import com.example.mywishlistapp.data.Wish
import com.example.mywishlistapp.data.WishRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch


class WishViewModel(
    private val wishRepository: WishRepository = Graph.wishRepository
) : ViewModel(){
    private var _wishTitleState by mutableStateOf("")
    val wishTitleState get() = _wishTitleState

    private var _wishDescriptionState by mutableStateOf("")
    val wishDescriptionState get () = _wishDescriptionState

    fun onWishTitleChanged(newTitle : String){
        _wishTitleState = newTitle
    }

    fun onWishDescriptionChanged(newDescription: String){
        _wishDescriptionState = newDescription
    }

    val getAllWishes : Flow<List<Wish>> = wishRepository.getAllWishses()

    fun addWish(wish : Wish){
        viewModelScope.launch(Dispatchers.IO) {
            wishRepository.addAWish(wish = wish)
        }
    }

    fun updateWish(wish: Wish){
        viewModelScope.launch(Dispatchers.IO) {
            wishRepository.updateAWish(wish = wish)
        }
    }

    fun getAWishById(id: Long) : Flow<Wish> {
        return wishRepository.getAWishById(id = id)
    }

    fun deleteAWish(wish: Wish){
        viewModelScope.launch(Dispatchers.IO){
            wishRepository.deleteAWish(wish = wish)
        }
    }
}