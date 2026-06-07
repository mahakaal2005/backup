package com.example.list_recycler

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        findViewById<Button>(R.id.btnRecyclerView).setOnClickListener {
            startActivity(Intent(this, RecyclerViewActivity::class.java))
        }
        
        findViewById<Button>(R.id.btnListView).setOnClickListener {
            startActivity(Intent(this, ListViewSimpleActivity::class.java))
        }
    }
}