package com.example.list_recycler.adapters

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.list_recycler.R
import com.example.list_recycler.data.Person

/**
 * Adapter for RecyclerView - connects data to the list
 */
class PersonRecyclerAdapter(
    private val personList: List<Person>
) : RecyclerView.Adapter<PersonRecyclerAdapter.PersonViewHolder>() {

    /**
     * ViewHolder holds references to views in each item
     * This helps RecyclerView reuse views efficiently
     */
    class PersonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val avatarCircle: View = itemView.findViewById(R.id.avatarCircle)
        val avatarInitial: TextView = itemView.findViewById(R.id.avatarInitial)
        val personName: TextView = itemView.findViewById(R.id.personName)
        val personEmail: TextView = itemView.findViewById(R.id.personEmail)
    }

    /**
     * Creates a new ViewHolder when RecyclerView needs one
     */
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PersonViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_person_recycler, parent, false)
        return PersonViewHolder(view)
    }

    /**
     * Binds data to an existing ViewHolder
     * This is called when an item needs to display data
     */
    override fun onBindViewHolder(holder: PersonViewHolder, position: Int) {
        // Get the person at this position
        val person = personList[position]
        
        // Set the person's name and email
        holder.personName.text = person.name
        holder.personEmail.text = person.email
        
        // Get first letter of name for avatar
        val initial = person.name.firstOrNull()?.uppercase() ?: "?"
        holder.avatarInitial.text = initial
        
        // Set the avatar background color
        val background = holder.avatarCircle.background as GradientDrawable
        background.setColor(Color.parseColor(person.avatarColor))
    }

    /**
     * Returns the total number of items in the list
     */
    override fun getItemCount(): Int {
        return personList.size
    }
}
