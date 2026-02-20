import { useState } from 'react';
import axios from 'axios'; // Assuming axios is available via a script tag or bundled

// Main App component
const App = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [generatedCode, setGeneratedCode] = useState(null);
    const [error, setError] = useState(null);

    // Base URL for your Node.js server
    const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your server's port

    // Function to handle the app generation process
    const generateApp = async () => {
        setIsGenerating(true);
        setGenerationStatus('Sending prompt to AI...');
        setGeneratedCode(null); // Clear previous results
        setDownloadUrl(null);
        setError(null);

        try {
            // Make an API call to your backend
            const response = await axios.post(`${API_BASE_URL}/api/generate/apk`, {
                prompt
            });

            if (response.data.success) {
                // Set the generated code and simulated download URL from the server response
                setGeneratedCode(response.data.codePreview);
                setDownloadUrl(response.data.downloadUrl);

                setGenerationStatus('AI generated code. Simulating app build process...');

                // Simulate a build time delay for user experience
                setTimeout(() => {
                    setGenerationStatus('Simulated build complete! See the React Native code below.');
                }, 3000); // 3-second delay for the simulated build message
            } else {
                // Handle API errors
                setError(response.data.error || 'Failed to generate app code.');
                setGenerationStatus('Failed to generate app code.');
            }
        } catch (err) {
            // Handle network or other unexpected errors
            console.error('App generation failed:', err);
            setError('Could not connect to the server or an unexpected error occurred. Please check console.');
            setGenerationStatus('Generation failed.');
        } finally {
            setIsGenerating(false); // End loading state
        }
    };

    return (
        <div className="app-container">
            <h1 className="app-title">AI Mobile App Code Generator</h1>
            <p className="app-description">Describe the React Native app you want to create:</p>

            <textarea
                className="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A simple weather app displaying current temperature and forecast for a given city. Include a search bar and a button to fetch data.'"
                rows={7}
            />

            <button
                className="generate-button"
                onClick={generateApp}
                disabled={isGenerating || !prompt.trim()} // Disable button if generating or prompt is empty
            >
                {isGenerating ? 'Generating...' : 'Generate React Native App Code'}
            </button>

            {isGenerating && (
                <div className="status-message loading">
                    <div className="spinner"></div>
                    <p>{generationStatus}</p>
                </div>
            )}

            {error && (
                <div className="status-message error">
                    <p>{error}</p>
                </div>
            )}

            {generatedCode && (
                <div className="result-section">
                    <h2 className="result-heading">Generated React Native Source Code:</h2>
                    <div className="warning-box">
                        <p>
                            <strong>Important Note:</strong> This is the *source code* for your React Native app.
                            Your server *simulates* the APK generation process and does not produce a runnable `.apk` file directly.
                            To get a real, downloadable `.apk` (or iOS `.ipa`), you would need to:
                        </p>
                        <ol>
                            <li>Set up a React Native development environment (e.g., install Node.js, Expo CLI or React Native CLI).</li>
                            <li>Copy this generated code into a new React Native project.</li>
                            <li>Use a build tool like <a href="https://docs.expo.dev/build/introduction/" target="_blank" rel="noopener noreferrer">Expo Application Services (EAS)</a> or the native Android/iOS build tools (Gradle/Xcode) to compile and sign the app.</li>
                        </ol>
                        <p>This process typically involves complex setup and is done outside of this web application.</p>
                    </div>
                    <pre className="code-display">
                        <code>{generatedCode}</code>
                    </pre>

                    {downloadUrl && (
                        <div className="download-info-section">
                            <p className="download-disclaimer">
                                A simulated download link was provided by the server. Clicking it will likely result in a 404 error
                                because no actual APK file is created or hosted by the server:
                            </p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="simulated-download-link"
                            >
                                Simulated APK Download Link
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Render the App component into the root div
ReactDOM.render(<App />, document.getElementById('root'));
