package com.example.quotesapp.models

import android.content.Context
import androidx.compose.runtime.mutableStateOf
import com.example.quotesapp.Pages
import com.google.gson.Gson

object DataManager {

    var data = emptyArray<Quote>()

    var currentPage = mutableStateOf(Pages.LISTING)
    var currentQuote: Quote?=null
    val isDataLoaded = mutableStateOf(false)

    fun loadAssetsFromFile(context: Context){
        val inputStream = context.assets.open("quotes.json") //opens a pipe from which you can now read data from
                                                                       //the /assets/quotes.json

        val size = inputStream.available() //Now it will tell how much bytes ca we read at a time here in it will give total file size

        val buffer = ByteArray(size) //Here we are making an array that can store bytes of size = size

        inputStream.read(buffer) //Start pulling bytes from the inputStream and fill this array.

        inputStream.close() //Now close the communication pipe

        val json=String(buffer, charset = Charsets.UTF_8) //Bytecode in buffer is converted to String with UTF_8 encoding
                                                                //so it becomes text and we can use it.

        val gson = Gson() //Creates a JSON parser object
                            //Gson is a library from google that can convert Json to objects and vice versa

        data = gson.fromJson(json,Array<Quote>::class.java) //We initialized data as emptyArray<Quote>
                                                                      //Now we are storing everything from Json by converting it into
                                                                      //Quote object in data as array
                                                    //Why ::class.java?
                                                    //Gson is a Java-based library
                                                    //Java uses Class<T> to describe types
                                                    //::class.java converts Kotlin type → Java Class
        isDataLoaded.value=true
    }

    fun switchPages(quote: Quote?) {
        if(currentPage.value == Pages.LISTING){
            currentQuote = quote
            currentPage.value = Pages.DETAIL
        }else{
            currentPage.value= Pages.LISTING
        }
    }
}