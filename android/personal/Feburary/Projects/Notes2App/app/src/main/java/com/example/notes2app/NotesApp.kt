package com.example.notes2app

import android.app.Application

class NotesApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Graph.provide(this)
    }
}