const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Use this before your routes are defined
app.use(express.json());

app.post('/endpoint', (req, res) => {
    console.log('Received from Roblox:', req.body.text);
    
    // Respond back to Roblox
    res.send('success');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
