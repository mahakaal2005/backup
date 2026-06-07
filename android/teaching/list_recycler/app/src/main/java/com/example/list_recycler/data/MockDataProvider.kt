package com.example.list_recycler.data

object MockDataProvider {
    
    private val colors = listOf(
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
        "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
    )
    
    private val firstNames = listOf(
        "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun",
        "Sai", "Arnav", "Ayaan", "Krishna", "Ishaan",
        "Shaurya", "Atharv", "Advait", "Pranav", "Dhruv",
        "Aadhya", "Ananya", "Pari", "Anika", "Ira",
        "Myra", "Sara", "Aanya", "Navya", "Kiara",
        "Diya", "Pihu", "Anvi", "Riya", "Saanvi"
    )
    
    private val lastNames = listOf(
        "Sharma", "Verma", "Kumar", "Singh", "Patel",
        "Gupta", "Reddy", "Yadav", "Jain", "Nair",
        "Mehta", "Kapoor", "Malhotra", "Agarwal", "Chopra",
        "Kulkarni", "Desai", "Iyer", "Pillai", "Shah"
    )
    
    fun getPersonList(): List<Person> {
        return (1..50).map { i ->
            val firstName = firstNames.random()
            val lastName = lastNames.random()
            Person(
                id = i,
                name = "$firstName $lastName",
                email = "${firstName.lowercase()}.${lastName.lowercase()}@example.com",
                avatarColor = colors[i % colors.size]
            )
        }
    }
}
