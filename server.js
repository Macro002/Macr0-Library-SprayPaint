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
        const processedImageBuffer = await sharp(imageBuffer)
            .resize(100, 100) // Resize the image to 100x100 pixels
            .toBuffer();

        // Example: Convert processed image buffer to base64 (or choose your method of sending back the data)
        const imageBase64 = processedImageBuffer.toString('base64');

        // Send the processed image back as a response
        // For demonstration, sending back a base64-encoded string; adjust according to your needs
        res.json({ status: 'success', message: 'Image processed.', data: imageBase64 });
    } catch (error) {
        console.error('Failed to process image:', error);
        res.status(500).json({ status: 'error', message: 'Error processing image.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
