function convertImageUrl() {
    const imageUrl = document.getElementById('imageUrlInput').value;
    if (imageUrl) {
        console.log("URL to be converted:", imageUrl);
        // Here, you can add your code to process the image URL
        // For example, sending it to a server-side script for conversion
    } else {
        alert("Please enter a URL.");
    }
}
