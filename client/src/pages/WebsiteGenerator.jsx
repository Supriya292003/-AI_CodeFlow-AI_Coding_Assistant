import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './WebsiteGenerator.css';

export default function WebsiteGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const generateWebsite = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate/website', {
        prompt
      });
      setGeneratedCode(response.data.code);
      setPreviewKey(prev => prev + 1); // Force iframe reload
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="website-generator">
      <h1>Website Generator</h1>
      <p>Describe the website you want to create</p>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A portfolio website for a photographer with dark theme and image gallery'"
        rows={5}
      />
      
      <button 
        onClick={generateWebsite}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate Website'}
      </button>
      
      {generatedCode && (
        <div className="result-section">
          <div className="tabs">
            <h3>Code Editor</h3>
            <Editor
              height="800px"
              defaultLanguage="html"
              value={generatedCode}
              onChange={(value) => setGeneratedCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 16
              }}
            />
          </div>
          
          <div className="tabs">
            <h3>Live Preview</h3>
            <iframe
              key={previewKey}
              title="Website Preview"
              srcDoc={generatedCode}
              style={{ 
                width: '120%', 
                height: '900px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div className="actions">
            <button className="secondary-btn">Download Code</button>
            <button className="primary-btn">Publish Website</button>
          </div>
        </div>
      )}
    </div>
  );
}