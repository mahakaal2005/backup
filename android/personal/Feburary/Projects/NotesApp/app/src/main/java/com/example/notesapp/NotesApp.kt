package com.example.notesapp

import android.app.Application
import com.example.notesapp.graph.Graph

class NotesApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Graph.provide(this)
    }
}