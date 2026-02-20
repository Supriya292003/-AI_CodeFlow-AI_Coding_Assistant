import { Link } from 'react-router-dom';
import './About.css'; // Optional - create this file for custom styling

function About() {
  return (
    <div className="about-container">
      <h1>About Our AI Generator</h1>
      
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          We're revolutionizing web and app development by making it accessible to everyone through AI. 
          No coding skills required - just describe what you want and we'll build it for you.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>1. Describe</h3>
            <p>Tell us what website or app you need using simple English</p>
          </div>
          <div className="feature-card">
            <h3>2. Generate</h3>
            <p>Our AI creates fully functional code in seconds</p>
          </div>
          <div className="feature-card">
            <h3>3. Customize</h3>
            <p>Edit the generated code or preview to make it perfect</p>
          </div>
          <div className="feature-card">
            <h3>4. Publish</h3>
            <p>Download or deploy your creation with one click</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Meet The Team</h2>
        <p>
          We're a group of AI enthusiasts and developers passionate about 
          democratizing technology creation.
        </p>
      </section>

      <Link to="/" className="home-link">
        ← Back to Home
      </Link>
    </div>
  );
}

export default About;