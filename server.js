const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/processImage', async (req, res) => {
    const { url, width = 100, height = 100 } = req.body; // Allow dynamic resizing
    if (!url) {
        return res.status(400).json({ status: 'error', message: 'No URL provided.' });
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;

        const processedImage = await sharp(imageBuffer)
            .resize(width, height) // Use dynamic dimensions
            .raw()
            .toBuffer();

        // Initialize an array to hold color data as strings
        const colorData = [];

        for (let i = 0; i < processedImage.length; i += 3) {
            const r = processedImage[i];
            const g = processedImage[i + 1];
            const b = processedImage[i + 2];
            // Convert RGB values to a hex string (or any format that suits your needs)
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            colorData.push(hex);
        }

        // Send the simplified color data back as a response
        res.json({ status: 'success', message: 'Image processed.', size: `${width}x${height}`, data: colorData });
    } catch (error) {
        console.error('Failed to process image:', error);
        res.status(500).json({ status: 'error', message: 'Error processing image.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
