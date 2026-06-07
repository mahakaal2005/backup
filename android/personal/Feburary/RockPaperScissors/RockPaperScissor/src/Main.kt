//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
fun main() {
    var playerChoice = ""
    var computerChoice = ""

    kotlin.io.println("Enter the player choice: Rock, Paper, or Scissors")
    playerChoice = readln()

    while(playerChoice !in listOf("Rock", "Paper", "Scissors")){
        println("invalid input, try again")
        playerChoice = readln()
    }

    val choice = (1..3).random()

    computerChoice = when (choice) {
        1 -> "Rock"
        2 -> "Paper"
        3 -> "Scissors"
        else -> "Rock"
    }

    println(computerChoice)

    val winner = when {
        playerChoice == computerChoice -> "It's a tie!"
        playerChoice == "Rock" && computerChoice == "Scissors" -> "Player wins!"
        playerChoice == "Paper" && computerChoice == "Rock" -> "Player wins!"
        playerChoice == "Scissors" && computerChoice == "Paper" -> "Player wins!"
        else -> "Computer wins!"
    }

    println(winner)
}