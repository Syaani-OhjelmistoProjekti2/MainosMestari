import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import StabilityForm from "./components/StabilityForm";
import StabilityForm2 from "./components/Stability2Form";
import Home from "./components/Home";
import "./App.css";

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
              <li>
                <Link to="/stability2">Stability2</Link>
              </li>
            </ul>
          </nav>

          {/* Reititys */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stability" element={<StabilityForm />} />
            <Route path="/stability2" element={<StabilityForm2 />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
