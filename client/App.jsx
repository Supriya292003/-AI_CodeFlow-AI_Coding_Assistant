import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import WebGenerator from './pages/WebGenerator';
import AppGenerator from './pages/AppGenerator';
import Signup from './pages/Signup';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-website" element={<WebGenerator />} />
        <Route path="/generate-apk" element={<AppGenerator />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
