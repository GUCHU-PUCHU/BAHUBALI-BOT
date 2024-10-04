const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "imagine",
        aliases: ["sd3", "dalle3"],
        version: "1.0.0",
        hasPermssion: 0,
        credits: "SHANKAR PROJECT",
        description: "Generate an image based on a prompt",
        commandCategory: "AI",
        usages: "/imagine <prompt>",
        cooldowns: 5,
        dependencies: {
            "axios": "",
            "fs": "",
            "path": ""
        }
    },
    run: async function({ api, event, args }) {
        // Check if user provided a prompt
        if (args.length === 0) return api.sendMessage("Please provide a prompt to generate an image.", event.threadID, event.messageID);

        const prompt = args.join(" ");
        const apiKey = "Pri_yanshu12";
        const apiUrl = `https://priyansh-ai.onrender.com/SD3?prompt=${encodeURIComponent(prompt)}&apikey=${apiKey}`;

        try {
            // Request the image from the API
            const response = await axios.get(apiUrl);

            if (!response.data || !response.data.imageUrl) {
                return api.sendMessage("Failed to generate image, please try again.", event.threadID, event.messageID);
            }

            const imageUrl = response.data.imageUrl;
            const imagePath = path.resolve(__dirname, 'cache', `${Date.now()}.jpg`);

            // Download the image
            const writer = fs.createWriteStream(imagePath);
            const imageResponse = await axios({
                url: imageUrl,
                method: 'GET',
                responseType: 'stream'
            });

            imageResponse.data.pipe(writer);

            // Wait for the image to finish downloading
            writer.on('finish', () => {
                // Send the image as an attachment
                api.sendMessage({
                    body: `Here is the generated image for your prompt: "${prompt}"`,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => {
                    // Clean up the image file after sending
                    fs.unlinkSync(imagePath);
                }, event.messageID);
            });

            writer.on('error', (err) => {
                api.sendMessage("Error downloading the image.", event.threadID, event.messageID);
            });

        } catch (error) {
            console.error("Error:", error);
            api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
        }
    }
};
