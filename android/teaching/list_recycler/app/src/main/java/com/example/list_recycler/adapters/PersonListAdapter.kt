package com.example.list_recycler.adapters

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView
import com.example.list_recycler.R
import com.example.list_recycler.data.Person

/**
 * Adapter for ListView - connects data to the list
 * This is the SIMPLEST way to create a ListView adapter
 */
class PersonListAdapter(
    private val context: Context,
    private val personList: List<Person>
) : BaseAdapter() {

    /**
     * Returns the total number of items
     */
    override fun getCount(): Int {
        return personList.size
    }

    /**
     * Returns the item at a given position
     */
    override fun getItem(position: Int): Person {
        return personList[position]
    }

    /**
     * Returns the ID of the item at a given position
     */
    override fun getItemId(position: Int): Long {
        return personList[position].id.toLong()
    }

    /**
     * Creates the view for each item in the list
     * This method is called every time an item needs to be displayed
     */
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        // Inflate (create) the layout for this item
        val view = LayoutInflater.from(context)
            .inflate(R.layout.item_person_list, parent, false)

        // Find all the views we need to update
        val avatarCircle = view.findViewById<View>(R.id.avatarCircle)
        val avatarInitial = view.findViewById<TextView>(R.id.avatarInitial)
        val personName = view.findViewById<TextView>(R.id.personName)
        val personEmail = view.findViewById<TextView>(R.id.personEmail)

        // Get the person for this position
        val person = getItem(position)

        // Set the person's name and email
        personName.text = person.name
        personEmail.text = person.email

        // Get first letter of name for avatar
        val initial = person.name.firstOrNull()?.uppercase() ?: "?"
        avatarInitial.text = initial

        // Set the avatar background color
        val background = avatarCircle.background as GradientDrawable
        background.setColor(Color.parseColor(person.avatarColor))

        return view
    }
}
