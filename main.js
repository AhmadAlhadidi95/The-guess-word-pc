// Setting the variables 
let numberOfTrys = 6
let numberOfLetters = 6
let currentTry = 1
let guessToWord = ``
let wordsList = [`Orange`, `Banana`, `Tomato`, `Purple`, `Butter`, `Animal`, `Yellow`, `Window`, `Mother`, `Father`, `Planet`, `Garden`]
let yourHints = 2
// Make random to the word 
let theWordIs = wordsList[Math.floor(Math.random() * wordsList.length)].toLowerCase()

function mainRoom() {

    for (let i = 1; i <= numberOfTrys; i++) {

        let guessBox = document.createElement("div")
        guessBox.className = `guess number-${i}`

        let tryBox = document.createElement("div")
        tryBox.className = `try`
        let inTryBox = document.createTextNode(`Try`)

        let tryNumber = document.createElement("b")
        let inTryNumber = document.createTextNode(i)
        tryNumber.appendChild(inTryNumber)

        tryBox.append(inTryBox, tryNumber)

        guessBox.appendChild(tryBox)

        if (i != 1) guessBox.classList.add("disabled")

        for (let j = 1; j <= numberOfLetters; j++) {
            
            let letterInput = document.createElement("input")
            letterInput.type = "text"
            letterInput.id = `guess-${i}-letter-${j}`
            letterInput.setAttribute("maxlength", "1")

            guessBox.appendChild(letterInput)
        }

        document.querySelector(".left-box").appendChild(guessBox)

    }

    let checkButton = document.createElement("input")
    checkButton.type = "button"
    checkButton.setAttribute("value", "Check word")
    
    let hintButton = document.createElement("input")
    hintButton.type = "button"
    hintButton.setAttribute("value", "Hint")

    let hintNumber = document.createElement("span")
    hintNumber.id = `hintNumber`
    hintNumber.innerHTML = yourHints

    document.querySelector(".left-box").append(checkButton, hintButton, hintNumber)

    document.querySelectorAll(".guess")[0].children[1].focus()

    document.querySelectorAll(".disabled input").forEach((input) => {input.disabled = true})

    let allInputs = document.querySelectorAll("input")
    
    allInputs.forEach((input, index) => {

        input.addEventListener("input", function () {

            this.value = this.value.toUpperCase()

            let nextInput = allInputs[index + 1]
            if (nextInput) nextInput.focus()

        })

        input.addEventListener("keydown", function (event) {

            let currentIndex = Array.from(allInputs).indexOf(event.target) // Or this
            
            if (event.key === "ArrowRight") {
                let nextInput = currentIndex + 1
                if (nextInput < allInputs.length) allInputs[nextInput].focus()
            }

            if (event.key === "ArrowLeft") {
                let prevInput = currentIndex - 1
                if (prevInput >= 0 ) allInputs[prevInput].focus()
            }

        })

    })

    checkOrHint(checkButton, hintButton)

}

function checkOrHint(check, hint) {

    check.addEventListener("click", function () {

        let successGuess = true

        for (let i = 1; i <= numberOfLetters; i++) {

            let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
            let letter = inputField.value.toLowerCase()
            let existLetter = theWordIs[i - 1]

            // The game logic
            if (letter === existLetter) {
                // Letter is correct and in Its Place
                inputField.classList.add("correct")

            } else if (theWordIs.includes(letter) && letter != "") {
                // Letter is correct but not in Its Place
                inputField.classList.add("not-place")
                successGuess = false

            } else {
                // Letter is wrong
                inputField.classList.add("wrong")
                successGuess = false
            }

        }

        // Check if user win or lose
        if (successGuess) {

            checkTheState()
            // Add disabled class on all try divs
            document.querySelectorAll(".left-box > div").forEach((guessDiv) => {guessDiv.classList.add("disabled")})
            // Put this style to the buttons
            check.style.cssText = "pointer-events: none; opacity: .5;"
            hint.style.cssText = "pointer-events: none; opacity: .5;"

        } else {

            // Put disabled class on current number
            document.querySelector(`.number-${currentTry}`).classList.add("disabled")
            // Make loop on all inputs inside the current number and make them disabled
            document.querySelectorAll(`.number-${currentTry} input`).forEach((input) => {input.disabled = true})
            // Increase 1
            currentTry++
            // Check if currentTry still accept increase or not
            if (document.querySelector(`.number-${currentTry}`)) {
                
                // Remove disabled class from current number
                document.querySelector(`.number-${currentTry}`).classList.remove("disabled")
                // Make loop on all inputs inside the current number and make them not disabled
                document.querySelectorAll(`.number-${currentTry} input`).forEach((input) => {input.disabled = false})
                // Make focus on the input 1 inside the current number
                document.querySelector(`.number-${currentTry}`).children[1].focus()

            } else {
                
                checkTheState(false)
                // Put this style to the buttons
                check.style.cssText = "pointer-events: none; opacity: .5;"
                hint.style.cssText = "pointer-events: none; opacity: .5;"

            }

        }

    })

    hint.addEventListener("click", function () {

        if (yourHints > 0) {
            // Decrease yourHints
            yourHints--
            // And put yourHints in its span again
            document.getElementById("hintNumber").innerHTML = yourHints
            // If yourHints equal 0 
            if (yourHints == 0) {
                // Put this style to the button
                hint.style.cssText = "pointer-events: none; opacity: .5;"
            }

        }
        // Get only inputs with enabled not disabled
        let enabledInputs = document.querySelectorAll("input:not([disabled])")
        // Make filter to get empty inputs, Without letters in them
        let emptyenabledInputs = Array.from(enabledInputs).filter((input) => input.value === "")
        
        if (emptyenabledInputs.length > 0) {
            // Make random number from emptyenabledInputs array
            let randomIndex = Math.floor(Math.random() * emptyenabledInputs.length)
            // Put the random number on its input in the emptyenabledInputs array
            let randomInput = emptyenabledInputs[randomIndex]
            // Get position number of empty input
            let indexToFill = Array.from(enabledInputs).indexOf(randomInput)

            if (indexToFill !== -1) {
                // Get randomInput.value and put the letter of word in it
                randomInput.value = theWordIs[indexToFill].toUpperCase()
            }
        }

    })

}

addEventListener("keydown", function (event) {

    if (event.key === "Backspace") {
        // Get only inputs with enabled not disabled
        let enabledInputs = Array.from(document.querySelectorAll("input:not([disabled])"))
        // Get the active input, from enabledInputs
        let currentIndex = enabledInputs.indexOf(document.activeElement)

        if (currentIndex > 0) {
            // Get the currentInput from its number in the array
            let currentInput = enabledInputs[currentIndex]
            // Get the prevInput from its number in the array
            let prevInput = enabledInputs[currentIndex - 1]
            // Make them empty
            currentInput.value = ""
            prevInput.value = ""
            // Make focus on the prevInput
            prevInput.focus()
            
        }

    }

})

function checkTheState(won = true) {

    if (won) {

        let massageBox = document.createElement("div")
        massageBox.className = `message-box animate__animated animate__backInUp`
    
        let congratulations = document.createElement("h3")
        let inCongratulations = document.createTextNode(`Congratulations`)
        congratulations.append(inCongratulations)
    
        let massage = document.createElement("p")
        let inMassage = document.createTextNode(`Wooow, you did it, the word is:`)
        massage.appendChild(inMassage)
    
        let theWord = document.createElement("h2")
        let inTheWord = document.createTextNode(`${theWordIs}`)
        theWord.appendChild(inTheWord)
    
        massageBox.append(congratulations, massage, theWord)
    
        document.querySelector(".right-box").append(massageBox)
        
    } else {
        
        let massageBox = document.createElement("div")
        massageBox.className = `message-box animate__animated animate__backInUp`
    
        let congratulations = document.createElement("h3")
        let inCongratulations = document.createTextNode(`Opsss`)
        congratulations.append(inCongratulations)
    
        let massage = document.createElement("p")
        let inMassage = document.createTextNode(`You lost, the word is:`)
        massage.appendChild(inMassage)
    
        let theWord = document.createElement("h2")
        let inTheWord = document.createTextNode(`${theWordIs}`)
        theWord.appendChild(inTheWord)
    
        massageBox.append(congratulations, massage, theWord)
    
        document.querySelector(".right-box").append(massageBox)

    }

}

window.onload = function () {
    mainRoom()
}