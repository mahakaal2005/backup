package com.example.list_recycler

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.list_recycler.data.MockDataProvider

/**
 * SIMPLEST ListView - using ArrayAdapter with built-in Android layout
 * No custom adapter needed!
 */
class ListViewSimpleActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_list_view)
        

        val listView = findViewById<ListView>(R.id.listView)
        
        // Get just the names from our person list
        val personList = MockDataProvider.getPersonList()
        val namesList = personList.map { it.name }  // Extract just names
        

        // android.R.layout.simple_list_item_1 is a built-in Android layout
        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_list_item_1,  // Built-in simple layout
            namesList
        )
        
        listView.adapter = adapter
        
        // Click listener
        listView.setOnItemClickListener { _, _, position, _ ->
            Toast.makeText(this, "Clicked: ${namesList[position]}", Toast.LENGTH_SHORT).show()
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
