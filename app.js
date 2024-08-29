const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import cors
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Load the question-answer data from the JSON file
const data = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

// Function to get the answer to a question
function getAnswer(question) {
    const entry = data.find(entry => entry.question.toLowerCase() === question.toLowerCase());
    if (entry) {
        return {
            answer: entry.answer,
            sources: entry.sources,
            ranked_lists: entry.ranked_lists,
            timestamp: entry.timestamp
        };
    } else {
        return { 
            answer: "Sorry, I don't know the answer to that question.",
            sources: [],
            ranked_lists: [],
            timestamp: null
        };
    }
}

// Endpoint to get the answer
app.post('/', async (req, res) => {
    const question = req.body.question;
    console.log("Received question:", question);
    const response = getAnswer(question);
    res.json(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
