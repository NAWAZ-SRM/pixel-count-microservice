const express = require('express');
const fetch = require('node-fetch'); // If using Node.js < 18, install this
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Function to get CSRF Token
const getCSRFToken = async () => {
    const response = await fetch('https://cerviai-omero.duckdns.org/api/v0/token/', {
        method: 'GET',
        credentials: 'include', // Important to include cookies in request
    });

    if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    return data.data; // Return the CSRF token
};

// Route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Get username and password from request body

    try {
        const csrfToken = await getCSRFToken(); // Fetch CSRF token

        const response = await fetch('https://cerviai-omero.duckdns.org/api/v0/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken, // Include CSRF token in the header
                Referer: 'https://cerviai-omero.duckdns.org/webclient/login/?url=%2Fwebclient%2F'
            },
            body: new URLSearchParams({
                username: username,
                password: password,
                server: 1, // Adjust as needed
                csrfmiddlewaretoken: csrfToken
            }),
            credentials: 'include', // Include cookies with the request
        });

        const data = await response.json();

        if (data.success) {
            // On successful login, redirect or respond with success message
            res.redirect('/home');
        } else {
            res.status(401).send('Login failed. Please check your credentials.');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Home route (just an example)
app.get('/home', (req, res) => {
    res.send('Welcome to the home page!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
