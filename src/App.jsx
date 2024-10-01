import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DallE2Form from './components/DallE2Form';
import DallE3Form from './components/DallE3Form';
import StabilityForm from './components/StabilityForm';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <div>
    <Router>
      <div>
        {/* Navigointilinkit */}
        <nav>
          <ul>
            <li>
              <Link to="/">Etusivu</Link>
            </li>
            <li>
              <Link to="/dall-e-2">Dall-E 2</Link>
            </li>
            <li>
              <Link to="/dall-e-3">Dall-E 3</Link>
            </li>
            <li>
              <Link to="/stability">Stability</Link>
            </li>
          </ul>
        </nav>

        {/* Reititys */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dall-e-2" element={<DallE2Form />} />
          <Route path="/dall-e-3" element={<DallE3Form />} />
          <Route path="/stability" element={<StabilityForm />} />
        </Routes>
      </div>
    </Router>
    
    </div>
  );
}

export default App;
