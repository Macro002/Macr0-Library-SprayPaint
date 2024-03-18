const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/endpoint', (req, res) => {
    console.log('Received data:', req.body);
    res.json({ status: 'success', message: 'Data received successfully.' });
});

// Add this block to handle GET requests
app.get('/endpoint', (req, res) => {
    res.send('GET request to the endpoint is not supported. Please use POST requests.');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
