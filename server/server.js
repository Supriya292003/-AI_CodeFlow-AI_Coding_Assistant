require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// Middleware
app.use(cors()); // Enable CORS for all origins (for local development)
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Generation Configurations for System Instructions
const generationConfig = {
  website: {
    systemInstruction: `You are an expert web developer. Generate complete, single-file HTML/CSS/JS code.
    Requirements:
    - Mobile-responsive design using modern CSS (e.g., Flexbox/Grid).
    - Visually appealing and modern aesthetic.
    - Valid HTML5 structure.
    - All CSS should be embedded in a <style> tag in the <head>.
    - All JavaScript should be embedded in a <script> tag at the end of the <body>.
    - Use Tailwind CSS by including its CDN link in the <head> if modern styling is requested.
    - Provide placeholder content for images (e.g., using placehold.co).
    - Ensure rounded corners on all elements.
    - Use 'Inter' font unless specified otherwise.
    Format: <!DOCTYPE html><html>...</html>`
  },
  app: {
    systemInstruction: `You are a mobile app developer. Generate complete, self-contained React Native code for the described app.
    Requirements:
    - Use functional components and hooks.
    - Ensure clear, modern UI design.
    - Include all key features from the prompt.
    - Provide a single App.js (or App.tsx) file with all necessary components.
    - Do NOT use external image URLs directly; use placeholder images or simple colored shapes if needed.
    - Do NOT include any API keys or sensitive information.
    - Include comments explaining the code structure and functionality.
    - Add a comment block at the beginning of the code with instructions on how to run the app (e.g., create new RN project, replace App.js, install dependencies, run).
    - Example structure:
    \`\`\`javascript
    import React from 'react';
    import { View, Text, StyleSheet } from 'react-native';

    const App = () => {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Your App Content Here</Text>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
    });

    export default App;
    \`\`\`
    `
  }
};

// Utility Function to Save Generated Files
const saveFile = (content, dir, ext) => {
  const filename = `${Date.now()}${ext}`;
  const filePath = path.join(__dirname, dir, filename);
  // Using synchronous write for simplicity in this example.
  // For high-traffic production, consider fs.writeFile (asynchronous)
  fs.writeFileSync(filePath, content);
  console.log(`File saved: ${filePath}`);
  return filename;
};

// API Endpoints

// Endpoint to Generate Website Code
app.post('/api/generate/website', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    console.log('Generating website for prompt:', prompt);

    // Gemini API call using the contents array format for consistency
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: generationConfig.website.systemInstruction + "\n\nUser Request: " + prompt }]
      }]
    });

    const response = await result.response;
    const code = response.text(); // Get the generated text content

    // Save the generated HTML code
    const filename = saveFile(code, 'public/generated', '.html');

    res.json({
      success: true,
      code, // Send the code back to the frontend for display
      previewUrl: `/generated/${filename}` // URL for iframe preview
    });

  } catch (error) {
    console.error('Website generation error:', error);
    // More detailed error logging for debugging
    if (error.response && error.response.data) {
      console.error('Gemini API Error Response:', error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to generate website. Please try a different prompt or check server logs.'
    });
  }
});

// Endpoint to Generate APK (Simulated React Native Code Generation)
app.post('/api/generate/apk', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    console.log('Generating React Native app code for prompt:', prompt);

    // Gemini API call using the contents array format
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: generationConfig.app.systemInstruction + "\n\nUser Request: " + prompt }]
      }]
    });

    const code = (await result.response).text(); // Get the generated React Native code
    const buildId = `build_${Date.now()}`; // Simulate a unique build ID

    // Simulate a "build process" delay. In a real scenario, this would involve
    // actual compilation of React Native code into an APK/IPA.
    setTimeout(() => {
      // In a real application, you would save the generated code and potentially
      // trigger a build pipeline here. For this example, we just return the code preview.
      res.json({
        success: true,
        buildId,
        status: 'completed',
        downloadUrl: `/downloads/${buildId}.apk`, // Placeholder download URL
        codePreview: code // Send the generated React Native code back
      });
    }, 3000); // 3-second delay to simulate build time

  } catch (error) {
    console.error('APK generation error:', error);
    if (error.response && error.response.data) {
      console.error('Gemini API Error Response:', error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to generate app. Please try a different prompt or check server logs.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Create required directories if they don't exist
  ['public/generated', 'public/downloads'].forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
});
