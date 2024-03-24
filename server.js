const express = require('express');
const sharp = require('sharp');
const fetch = require('node-fetch');
const app = express();
const port = 3000; // You can use any port that's free on your machine

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/process-image', async (req, res) => {
    const { imageUrl } = req.body; // Extract imageUrl from the request body

    try {
        const response = await fetch(imageUrl); // Fetch the image from the URL
        const buffer = await response.buffer(); // Get the image as a buffer

        sharp(buffer).metadata().then(metadata => {
            res.json({
                width: metadata.width,
                height: metadata.height
            }); // Send back the dimensions
        }).catch(error => {
            console.error("Error processing image with Sharp:", error);
            res.status(500).send("Error processing image");
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Error fetching image");
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
