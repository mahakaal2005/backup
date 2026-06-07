package com.example.countermvvm

import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableIntStateOf
import androidx.lifecycle.ViewModel

class CounterViewModel : ViewModel(){
    private val _repository = CounterRepository()
    private var _count = mutableIntStateOf(_repository.getCounter().count)

    val count : MutableState<Int> = _count

    fun increment(){
        _repository.incrementCounter()
        _count.intValue=_repository.getCounter().count
    }

    fun decrement(){
        _repository.decrementCounter()
        _count.intValue=_repository.getCounter().count
    }
}