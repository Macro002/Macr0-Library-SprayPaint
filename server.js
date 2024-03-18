const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the port provided by the environment or 3000 if not available

app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to handle POST requests
app.post('/endpoint', (req, res) => {
    console.log('Received data:', req.body); // Log the received data
    
    // Respond with a success message
    res.json({ status: 'success', message: 'Data received successfully.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
