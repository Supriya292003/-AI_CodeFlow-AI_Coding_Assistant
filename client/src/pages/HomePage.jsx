import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      
      <h1>AI Website & APK Generator</h1>
       <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <p className="subtitle">Create professional websites and Android apps with simple prompts</p>
      
     

      <div className="cta-buttons">
        <button 
          className="primary-btn"
          onClick={() => navigate('/website')}  // Updated to match your routes
        >
          Create Website
        </button>
        <button 
          className="primary-btn"
          onClick={() => navigate('/apk')}  // Updated to match your routes
        >
          Create APK
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Website Generator</h3>
          <p>Describe your website and get fully functional code instantly</p>
        </div>
        <div className="feature-card">
          <h3>APK Generator</h3>
          <p>Turn your app idea into a downloadable Android package</p>
        </div>
      </div>
    </div>
  );
}