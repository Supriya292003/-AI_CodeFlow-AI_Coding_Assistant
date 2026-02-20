import { useState } from 'react';
import axios from 'axios';
import './APKGenerator.css'; // Ensure this CSS file is in the same directory

export default function APKGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  const [generatedCode, setGeneratedCode] = useState(null); // New state for generated code
  const [error, setError] = useState(null); // New state for error messages

  const generateAPK = async () => {
    setIsGenerating(true);
    setGenerationStatus('Generating app code...'); // Initial status
    setGeneratedCode(null); // Clear previous code

    setError(null); // Clear previous errors

    try {
      const response = await axios.post('/api/generate/apk', {
        prompt
      });

      if (response.data.success) {
        setGeneratedCode(response.data.codePreview); // Capture the generated code


        setGenerationStatus('App code generated successfully! Simulating build...');

        // Simulate building process (this timeout is for the status message, not actual build)
        setTimeout(() => {
          setGenerationStatus('Simulated build complete. React Native code is ready.');
        }, 3000); // Wait 3 seconds for the "simulated build" message
      } else {
        setError(response.data.error || 'Failed to generate app code.');
        setGenerationStatus('Failed to generate app code.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Could not connect to server or an unexpected error occurred.');
      setGenerationStatus('Failed to generate app. Please check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="apk-generator-container">
      <h1 className="title">AI Mobile App Code Generator</h1>
      <p className="description">Describe the React Native app you want to create:</p>

      <textarea
        className="prompt-textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A simple expense tracker app with add, view, and delete functionalities. Use a modern UI design.'"
        rows={6}
      />

      <button
        className="generate-button"
        onClick={generateAPK}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate React Native App Code'}
      </button>

      {isGenerating && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>{generationStatus}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {generatedCode && (
        <div className="result-section">
          <h2 className="result-title">Generated React Native Code with Steps to run the app:</h2>

          <pre className="code-display">
            <code>{generatedCode}</code>
          </pre>


        </div>
      )}
    </div>
  );
}