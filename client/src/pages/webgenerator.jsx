import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './WebGenerator.css';
import Modal from 'react-modal'; // Import react-modal

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

export default function WebsiteGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
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

  const generateWebsite = async () => {
    setIsGenerating(true);
    setGeneratedCode(''); // Clear previous code
    setPreviewKey(prev => prev + 1); // Force iframe reload immediately
    try {
      const response = await axios.post('http://localhost:5000/api/generate/website', {
        prompt
      });
      setGeneratedCode(response.data.code);
      // No need to force iframe reload again here, it's already done above
    } catch (error) {
      console.error('Generation failed:', error);
      showAlert('Failed to generate website. Please ensure the backend server is running and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="website-generator">
      <h1>Website Generator</h1>
      <p>Describe the website you want to create:</p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A portfolio website for a photographer with dark theme and image gallery'"
        rows={5}
        className="prompt-textarea" // Add class for styling
      />

      <button
        onClick={generateWebsite}
        disabled={isGenerating || !prompt.trim()}
        className="generate-button" // Add class for styling
      >
        {isGenerating ? 'Generating...' : 'Generate Website'}
      </button>

      {isGenerating && (
        <div className="loading-indicator">
          <div className="spinner"></div> {/* Spinner for loading */}
          <p>Generating website code...</p>
        </div>
      )}

      {generatedCode && (
        <div className="result-section">
          <div className="tabs">
            <h2>Code Editor</h2>
            <Editor
              height="800px"
              defaultLanguage="html"
              value={generatedCode}
              onChange={(value) => setGeneratedCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: 'on', // Enable word wrapping
                scrollBeyondLastLine: false, // Prevent extra scroll space
              }}
            />
          </div>

          <div className="tabs">
            <h2>Live Preview</h2>
            <iframe
              key={previewKey}
              title="Website Preview"
              srcDoc={generatedCode}
              style={{
                width: '100%', // Changed to 100% for better responsiveness within its container
                height: '900px',
                border: '1px solid #ddd',
                borderRadius: '8px', // More rounded corners
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow
              }}
            />
          </div>

          <div className="actions">
            <button className="secondary-btn" onClick={() => {
              const blob = new Blob([generatedCode], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'index.html';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}>Download Code</button>
          </div>
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
