import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react'; // Import Monaco Editor
import Modal from 'react-modal'; // Import react-modal for custom alerts
import './AppGenerator.css'; // Ensure this CSS file is in the same directory

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root'); // Assuming your root element is <div id="root">

// Custom styles for the modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    backgroundColor: '#fff',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

// Custom Alert Modal Component
const CustomAlertModal = ({ isOpen, message, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Alert Message"
    >
      <h2>Alert</h2>
      <p>{message}</p>
      <button onClick={onClose} style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '16px',
      }}>
        OK
      </button>
    </Modal>
  );
};

export default function APKGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  const [generatedCode, setGeneratedCode] = useState(null); // State for generated code
  const [error, setError] = useState(null); // State for error messages

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showAlert = (message) => {
    setModalMessage(message);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMessage('');
  };

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
        showAlert(response.data.error || 'Failed to generate app code.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Could not connect to server or an unexpected error occurred.');
      setGenerationStatus('Failed to generate app. Please check console for details.');
      showAlert('Could not connect to server or an unexpected error occurred. Please check console.');
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
          <h2 className="result-title">Generated React Native Code:</h2>
          <Editor
            height="700px"
            width="700px" // Adjust height as needed
            defaultLanguage="javascript" // Or 'typescript' if you prefer
            value={generatedCode}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              readOnly: false, // Make it read-only as it's a preview
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
          />
          <p className="note">
            The code above is a preview. For a runnable APK, you would need to set up a React Native project and build it.
          </p>
        </div>
      )}

      <CustomAlertModal
        isOpen={modalIsOpen}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
}
