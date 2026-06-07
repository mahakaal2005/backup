package com.example.quotesapp.Screens

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import com.example.quotesapp.models.Quote


@Composable
fun QuoteList(data:Array<Quote> , onClick:(Quote)-> Unit) {
    LazyColumn(

    ) {
        items(data){
            QuoteListItem(quote = it , onClick)
        }
    }
}