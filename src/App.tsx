import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ImageUploader from "./components/ImageUploader";
import StabilityForm from "./components/StabilityForm";

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
            <Route path="/stability2" element={<ImageUploader />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
