const express = require('express');
const sharp = require('sharp');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// In-memory storage for the last processed image data
let lastProcessedImageData = {};

app.post('/process-image', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).send("No imageUrl provided");
    }

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch the image: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("image")) {
            return res.status(400).send("URL did not point to a valid image");
        }

        const buffer = await response.buffer();

        sharp(buffer)
            .resize(25, 25, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .raw()
            .toBuffer()
            .then(data => {
                const pixels = [];
                for (let i = 0; i < data.length; i += 3) {
                    pixels.push({
                        r: data[i],
                        g: data[i + 1],
                        b: data[i + 2]
                    });
                }
                return sharp(data, {
                    raw: {
                        width: 25,
                        height: 25,
                        channels: 3
                    }
                }).metadata().then(metadata => ({metadata, pixels}));
            })
            .then(({metadata, pixels}) => {
                // Store the processed image data
                lastProcessedImageData = {
                    width: metadata.width,
                    height: metadata.height,
                    pixels: pixels
                };
                // Respond with the processed image data in JSON format
                res.json(lastProcessedImageData);
            })
            .catch(error => {
                console.error("Error processing image with Sharp:", error);
                res.status(500).send("Error processing image");
            });
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Error fetching image");
    }
});

// Use the same path for a GET request to retrieve the last processed image data
app.get('/process-image', (req, res) => {
    if (Object.keys(lastProcessedImageData).length) {
        // Respond with the stored image data as plain text JSON
        res.type('text/plain').send(JSON.stringify(lastProcessedImageData, null, 2));
    } else {
        // No image data found
        res.status(404).send('No image data found. Please process an image first.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
