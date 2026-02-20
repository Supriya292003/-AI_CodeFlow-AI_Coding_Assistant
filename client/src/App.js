
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WebGenerator from './pages/webgenerator';
import AppGenerator from './pages/AppGenerator';
import About from './pages/About';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/website" element={<WebGenerator />} />
        <Route path="/apk" element={<AppGenerator />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;