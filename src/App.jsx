import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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
              <Link to="/">MainosMestari</Link>
            </li>
            <li>
              <Link to="/stability">Stability</Link>
            </li>
          </ul>
        </nav>

        {/* Reititys */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stability" element={<StabilityForm />} />
        </Routes>
      </div>
    </Router>
    
    </div>
  );
}

export default App;
