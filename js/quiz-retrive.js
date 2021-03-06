// Setting things up for starting the questionary
document.querySelector('#start')
    .addEventListener('click', (event) => {

        // Data to fetch the questions
        let number = document.querySelector('#number').value
        let category = document.querySelector('.settings__selected-categories').id
        let difficulty = document.querySelector('.settings__selected-difficulty').id
        let type = document.querySelector('.settings__selected-type').id

        if (number || category || difficulty || type) {

            // Create an custom url based on the user settings
            let url = `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=${type} `

            //Retrive questions from the API
            getQuestions(url)
        } else {
            alert()
        }

        // Prevent default behaviour
        event.preventDefault()
    })

// Retreive the data from the API
const getQuestions = (url) => {

    //Retreiving questions from the API
    fetch(url)
        .then(res => res.json())
        .then(res => {
            // Print response
            console.log(res)

            // Make sure the API return enough questions and no an error
            if (res['response_code'] == 0) {
                // Go to the quiz page
                insertQuestions(res['results'])
            } else {
                document.querySelector('main.container').classList.remove('to-quiz')
                document.querySelector('main.container').classList.add('to-settings')
                alert("Seems like we don't have enough questions for this game")
            }
        })
        .catch(res => console.log(res))
}

// Retreive questions from the API
const insertQuestions = (data) => {
    const questionsContainer = document.querySelector('#question-container')
    // Insert questions 
    questionsContainer.innerHTML = `
    ${data.map((question) => {
        //Collect answers of the current question
        let answers = question['incorrect_answers']
        answers.push(question['correct_answer'])
        answers.sort()

        // Print questions
        return `<div class="question">
        <span class="question__answers-correct">${question['correct_answer']}</span>
        <h2 class="heading-secondary question__title">${question['question']}</h2>
        <div class="question__answers">
        ${answers.map((answer, index) => {
            return `<div class="answer">
            <input type="radio" name="${question['question']}" id="${(answer + index)}">
            <label for="${answer + index}">${answer}</label> 
            </div>`
        }).join('')}
        </div>
        </div>`
    }).join('')}
    `
    questionsContainer.firstElementChild.classList.add('current')
}

// Next question
document.querySelector('#next').addEventListener('click', (e) => {
    // Save the current question user is watching
    const current = document.querySelector('.current')
    const answers = current.lastElementChild.children
    let checked = 0

    Array.prototype.forEach.call(answers, answer => {
        if (answer.firstElementChild.checked) {
            checked += 1

            if (current.nextElementSibling) {
                current.nextSibling.classList.add('current')
                current.classList.remove('current')
                current.classList.add('completed')
            }
        }
    })

    if (checked == 0) {
        const alertMessage = document.querySelector('.alert__message')

        alertMessage.parentElement.classList.add('active')
        alertMessage.innerHTML = 'You have to mark an answer'

        setTimeout(() => {
            alertMessage.parentElement.classList.remove('active')
        }, 3000)
    }

    // If there exist another elemet after the current quesiton, go to it
})

// Previous question
document.querySelector('#prev').addEventListener('click', (e) => {
    const current = document.querySelector('.current')

    if (current.previousElementSibling) {
        current.previousSibling.classList.add('current')
        current.previousSibling.classList.remove('completed')
        current.classList.remove('current')
    }
})

// Show results
document.querySelector('#results').addEventListener('click', (e) => {
    let counter = 0
    let correctAnswers = 0
    const results = document.querySelector('#results-section')
    const questions = document.querySelectorAll('.question')

    // Count questions that are filled
    Array.prototype.forEach.call(questions, question => {
        let answers = question.lastElementChild.children

        Array.prototype.forEach.call(answers, answer => {
            if (answer.firstElementChild.checked) {
                // Increase the number of answers alredy answered
                counter += 1

                // Display results
                results.firstElementChild.innerHTML += `
                    <div class="results__question">
                        <h2 class="results__question--title">${question.children[1].textContent}</h2>
                        <div class="results__question--answers">
                            <p class="results__question--answer">Correct answer: ${question.firstElementChild.textContent}</p>
                            <p class="results__question--answer">Your answer: ${answer.lastElementChild.textContent}</p>
                        </div>
                    </div>
                `

                // Verify if the answer is correct
                if (answer.lastElementChild.innerHTML == question.firstElementChild.innerHTML) {
                    correctAnswers += 1
                }
            }
        })
    })

    results.innerHTML += `
        <h2 class="heading-secondary score">${correctAnswers} / ${counter}</h2>
    `

    if (counter == questions.length) {
        document.querySelector('main.container').classList.remove('to-quiz')
        document.querySelector('main.container').classList.add('to-results')
    }
})

