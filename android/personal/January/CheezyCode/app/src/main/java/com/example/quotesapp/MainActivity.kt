package com.example.quotesapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.quotesapp.Screens.QuoteDetail
import com.example.quotesapp.Screens.QuoteListScreen
import com.example.quotesapp.models.DataManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        CoroutineScope(Dispatchers.IO).launch{
            DataManager.loadAssetsFromFile(applicationContext)
        }
        setContent {
            App()
        }
    }
}

@Composable
fun App(modifier: Modifier = Modifier) {
    if(DataManager.currentPage.value == Pages.LISTING){
        if(DataManager.isDataLoaded.value){
            QuoteListScreen(data = DataManager.data){
                DataManager.switchPages(it)
            }
        }
    }else{
        DataManager.currentQuote?.let { QuoteDetail(quote = it) }
    }
}

enum class Pages{
    LISTING,
    DETAIL
}

