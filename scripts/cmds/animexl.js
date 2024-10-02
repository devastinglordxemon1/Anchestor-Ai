const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anixl",
    aliases: [],
    author: "Redwan",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image using the Anixl API.",
    longDescription: "Generates an image using the provided prompt with the Anixl API.",
    category: "fun",
    guide: "{p}anixl <prompt>"
  },
  onStart: async function ({ message, args, api, event }) {
    
    const obfuscatedAuthor = String.fromCharCode(82, 101, 100, 119, 97, 110); // "Redwan"
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID, event.messageID);
    }

    api.sendMessage("Please wait, we're generating your image...", event.threadID, event.messageID);

    try {
      const apiUrl = `https://mahir-ammuke-chudlam.onrender.com/generate?prompt=${encodeURIComponent(prompt)}`;
      console.log(`Requesting URL: ${apiUrl}`);

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      console.log("API response received");

      // Ensure cache directory exists
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      // Save image to cache with a timestamped filename
      const imagePath = path.join(cacheDir, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));
      console.log(`Image saved at: ${imagePath}`);

      // Send the generated image
      const imageStream = fs.createReadStream(imagePath);
      api.sendMessage({
        body: `Here is your generated image for the prompt: "${prompt}"`,
        attachment: imageStream
      }, event.threadID);
      console.log("Image sent");

    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An unexpected error occurred. Please try again later.";

      // Specific error handling
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "❌ | Bad request. Please check your input.";
        } else if (error.response.status === 500) {
          errorMessage = "❌ | Server error. Try again later.";
        } else {
          errorMessage = `❌ | Error: ${error.response.statusText}`;
        }
      } else {
        errorMessage = `❌ | ${error.message}`;
      }

      // Notify the user of the error
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
