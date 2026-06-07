package com.example.list_recycler

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.list_recycler.data.MockDataProvider

class RecyclerViewActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_recycler_view)
        
        supportActionBar?.title = "RecyclerView Demo"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = SimpleAdapter(MockDataProvider.getPersonList().map { it.name })
    }
    
    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}

class SimpleAdapter(private val items: List<String>) : 
    RecyclerView.Adapter<SimpleAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textView: TextView = view.findViewById(android.R.id.text1)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_1, parent, false)
        
        // Add visual separation with background and margin
        view.setBackgroundResource(R.drawable.item_background)
        val params = view.layoutParams as RecyclerView.LayoutParams
        params.setMargins(8, 8, 8, 8)
        view.layoutParams = params
        
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.textView.text = items[position]
    }

    override fun getItemCount() = items.size
}
