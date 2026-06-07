package com.example.countermvvm

data class CounterModel (var count: Int)

class CounterRepository(){
    private var _counter = CounterModel(0);

    fun getCounter()=_counter

    fun decrementCounter(){
        _counter.count--
    }

    fun incrementCounter(){
        _counter.count++
    }

}