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

app.post('/process-image', async (req, res) => {
    const { imageUrl } = req.body; // Extract imageUrl from the request body

    if (!imageUrl) {
        return res.status(400).send("No imageUrl provided");
    }

    try {
        const response = await fetch(imageUrl); // Fetch the image from the URL

        if (!response.ok) {
            throw new Error(`Failed to fetch the image: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("image")) {
            return res.status(400).send("URL did not point to a valid image");
        }

        const buffer = await response.buffer(); // Get the image as a buffer
        
        // Resize the image with Sharp while keeping the aspect ratio
        sharp(buffer)
            .resize(25, 25, { // Resize to maximum 25x25 pixels
                fit: sharp.fit.inside, // Keep the aspect ratio
                withoutEnlargement: true // Do not enlarge if the image is smaller than 25x25 pixels
            })
            .toBuffer()
            .then(data => sharp(data).metadata()) // Get metadata of resized image
            .then(metadata => {
                res.json({
                    width: metadata.width,
                    height: metadata.height
                }); // Send back the resized dimensions
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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
