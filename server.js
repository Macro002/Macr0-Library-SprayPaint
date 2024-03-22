const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/processImage', async (req, res) => {
    const imageUrl = req.body.url;
    if (!imageUrl) {
        return res.status(400).json({ status: 'error', message: 'No URL provided.' });
    }

    try {
        // Fetch the image from the URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;

        // Process the image with Sharp
        const processedImage = await sharp(imageBuffer)
            .resize(100, 100) // Resize the image to 100x100 pixels
            .raw() // Get raw pixel data
            .toBuffer();

        // Convert the raw data into a 2D array of colors
        const pixelData = [];
        for (let i = 0; i < processedImage.length; i += 3) {
            const row = Math.floor(i / 3 / 100);
            const col = Math.floor(i / 3 % 100);
            const r = processedImage[i];
            const g = processedImage[i + 1];
            const b = processedImage[i + 2];

            if (!pixelData[row]) {
                pixelData[row] = [];
            }

            // Store the color data for each pixel
            pixelData[row][col] = { r, g, b };
        }

        // Send the pixel data back as a response
        res.json({ status: 'success', message: 'Image processed.', data: pixelData });
    } catch (error) {
        console.error('Failed to process image:', error);
        res.status(500).json({ status: 'error', message: 'Error processing image.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
