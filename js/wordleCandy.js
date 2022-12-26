// Five letter nouns
const WORDLES = [
    "Adult", "Apple", "Block", "Blood", "Chair", "Dance", "Earth", "Field", "Group", "Horse",
    "Image", "Judge", "Light", "Match", "Night", "Owner", "Party", "Radio",
    "Scene", "Table", "Value", "World", "Youth"
]

// GAME STATE VARIABLES
let userGuesses
let computerWord
let maximumNumberOfTurns      // add how many turns a player can guess
let characters

// PROMPT RESULT OPTIONS
const USER_HAS_WON = "user-has-won"
const OUT_OF_GUESSES = "out-of-guesses"
const SYNTAX_ERROR = "syntax-error"
const PLAY_AGAIN = "play-again"
const WORD_HANDLED = "word-handled"

const allKeys = document.querySelectorAll(".key")
const allSquares = document.querySelectorAll(".square")

function initializeGame() {
    maximumNumberOfTurns = 6
    // TODO: call function with document.createElement to fill with squares
    userGuesses = []
    characters = []
    clearSquares()

    computerWord = getComputerWord().toUpperCase()
    // computerWord = "apple".toUpperCase()
    console.log("candy wordle", computerWord)
}

function getComputerWord() {
    return WORDLES[Math.floor(Math.random() * WORDLES.length)]
}

function clearSquares() {
    allSquares.forEach(function (square) {
        square.innerHTML = ""
        square.classList.remove("right")
        square.classList.remove("wrong")
        square.classList.remove("almost")
    })
    allKeys.forEach(function (key) {
        key.classList.remove("wrong")
    })
}

function userSelection(userInput) {
    const pattern = /^[A-Z]{5}$/i
    userInput = userInput.toUpperCase().trim()

    // if (userInput.match(pattern)) {
    if (pattern.test(userInput)) {
        userGuesses.push(userInput)
        const userHasWon = computerWord === userInput
        const lastLettersRightPosition = ["_", "_", "_", "_", "_"]
        const lastLettersWrongPosition = []
        let index = 0
        for (let letter of userInput) {
            const keyElement = document.getElementById(letter.toLowerCase());
            if (computerWord.indexOf(letter) === -1) {
                if (!keyElement.classList.contains("wrong")) keyElement.classList.add("wrong")
            }
            ((i) => {
                setTimeout(() => {
                    let square = allSquares[(userGuesses.length - 1) * 5 + i]
                    // if the letter exist in computerWord AND
                    // the letter is in the right position
                    if (computerWord.indexOf(letter, i) === userInput.indexOf(letter, i)) {
                        lastLettersRightPosition[computerWord.indexOf(letter, i)] = letter
                        square.classList.add("right")
                        //if (!keyElement.classList.contains("right")) keyElement.classList.add("right")

                        // if the letters exist in computerWord
                        // but the letter is in wrong position
                    } else if (computerWord.indexOf(letter) !== -1) {
                        if (lastLettersWrongPosition.indexOf(letter) === -1 &&
                            lastLettersRightPosition.indexOf(letter) === -1) {
                            lastLettersWrongPosition.push(letter)
                            square.classList.add("almost")
                            // console.log("Right letters in wrong position: " + lettersWrongPosition)
                            //if (!keyElement.classList.contains("almost")) keyElement.classList.add("almost")
                        } else {
                            square.classList.add("wrong")
                            //if (!keyElement.classList.contains("wrong")) keyElement.classList.add("wrong")
                        }
                    } else {
                        square.classList.add("wrong")
                        //if (!keyElement.classList.contains("wrong")) keyElement.classList.add("wrong")
                    }
                }, index * 80)
            })(index);
            index++
        }
        console.log("Right: ", lastLettersRightPosition)
        console.log("Wrong:", lastLettersWrongPosition)
        if (userHasWon) {
            return USER_HAS_WON
        }
        if (userGuesses.length === maximumNumberOfTurns) {
            // TODO: Verify
            return OUT_OF_GUESSES
        }
        return WORD_HANDLED
    } else {
        return SYNTAX_ERROR
    }
}

let userInput
let result

const closeWindow = document.querySelector(".close")
const divShowResult = document.querySelector(".show-result")
const keyboard = document.querySelector(".keyboard-container")
const playAgain = document.querySelector(".play-again")

closeWindow.addEventListener("click", function (e) {
    if (this.textContent === "❎") {
        divShowResult.classList.toggle("active");
    }
})

initializeGame()

allKeys.forEach(function (key) {
    key.addEventListener("click", function (e) {
        // console.log(this.className)
        console.log("THIS KEY: " + this.textContent)
        if (this.textContent !== null
            && this.textContent !== "back"
            && this.textContent !== "enter"
            && this.textContent !== "play again"
            && characters.length < 5) {
            // console.log("Pressed the key")
            console.log("Before push - array: " + characters)
            console.log(characters.length % 5)
            characters.push(this.textContent)
            console.log("After push - array: " + characters)
            console.log("thisContent: " + this.textContent)
            let thisSquare = allSquares[userGuesses.length * 5 + characters.length - 1]
            let charSpan = document.createElement("span")
            let char = this.textContent
            charSpan.textContent = char
            thisSquare.append(charSpan)
            console.log("successfully")
        } else if (this.textContent === "back") {
            console.log("Now I remove a character with back")
            characters.pop()
            allSquares[userGuesses.length * 5 + characters.length].innerHTML = ""
            console.log(characters)
        } else if (this.textContent === "enter"
            && characters.length % 5 !== 0) {
            // TODO: inform user
            divShowResult.classList.add("active")
            let infoText = document.querySelector(".result-content")
            infoText.innerHTML = ""
            let header = document.createElement("h2")
            header.textContent = "Choose Five Letters 🔤"
            let info = document.createElement("p")
            info.textContent = "Please choose five letters before clicking enter"
            infoText.appendChild(header)
            infoText.appendChild(info)
            console.log("Do nothing with enter")
        } else if (this.textContent === "enter"
            && characters.length % 5 === 0) {
            // TODO: animation or something
            let word = characters.join("")
            let userInput = word.slice(word.length - 5, word.length)
            result = userSelection(userInput)
            characters = []
            console.log(result)

        } else if (this.textContent === "play again") {
            console.log("Play again")
            divShowResult.classList.remove("active")
            keyboard.classList.remove("hidden")
            playAgain.classList.add("hidden")
            initializeGame()
            return result = PLAY_AGAIN
        }

        if (result === USER_HAS_WON) {
            setTimeout(() => {
                divShowResult.classList.add("active")
                keyboard.classList.add("hidden")
                playAgain.classList.remove("hidden")
                let infoText = document.querySelector(".result-content")
                infoText.innerHTML = ""
                infoText.innerHTML = `<h2>Congrats!</h2>
                <h2>🏆</h2>
                <h3>You won 🏅</h3>
                <p>Correct word was: '<strong>${computerWord.toUpperCase()}</strong>'.
                <p>Your guesses: <br>
                ${userGuesses.join(" –– ")}</p>`
            }, 2000)
            return
        }
        if (result === OUT_OF_GUESSES) {
            setTimeout(() => {
                console.log("result === Out of guesses")
                divShowResult.classList.add("active")
                keyboard.classList.add("hidden")
                playAgain.classList.remove("hidden")
                // keyboard.classList.add("hidden")
                // playAgain.classList.remove("hidden")
                let infoText = document.querySelector(".result-content")
                infoText.innerHTML = ""
                infoText.innerHTML = `<h2>Oh no!</h2>
                                  <h3>You are out of guesses.</h3>
                                  <p>Correct word was: '<strong>${computerWord.toUpperCase()}</strong>'.
                                  <p>Your guesses: <br>
                                  ${userGuesses.join(" –– ")}</p>`
                // let infoText = document.querySelector(".result-content")
                // infoText.innerHTML = ""
                // let header = document.createElement("h2")
                // header.textContent = "Oh no! You are out of guesses."
                // let info = document.createElement("p")
                // info.textContent = `Correct word was '${computerWord.toUpperCase()}'`
                // infoText.appendChild(header)
                // infoText.appendChild(info)
            }, 2000)
            return
        }
    })
})





