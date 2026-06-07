package com.example.basicstatecodelab


import androidx.compose.runtime.toMutableStateList
import androidx.lifecycle.ViewModel

class WellnessViewModel : ViewModel() {
    private val _tasks =  getWellnessTasks().toMutableStateList()

    /*
         * Using a custom getter instead of direct assignment.
         * `=` stores the value once at initialization,
         * while `get()` returns the current value every time.
         * This ensures the property always reflects the latest state of _tasks.
     */
    val tasks : List<WellnessTask>
        get()=_tasks


    fun remove(item: WellnessTask){
        _tasks.remove(item)
    }

    fun checkTaskChanged(item: WellnessTask ,checked : Boolean){
        _tasks.find { it.id == item.id }?.let { task ->
            task.checked = checked
        }
    }
}

private fun getWellnessTasks() = List(30) {i-> WellnessTask(id =i, label = "Task #$i",false) }