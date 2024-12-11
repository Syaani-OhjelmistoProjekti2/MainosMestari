import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ImageUploader from "./components/ImageUploader";
import StabilityForm from "./components/StabilityForm";

function App() {
  return (
    <Router>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-md">
        <ul className="flex justify-center items-center gap-6 p-4">
          <li>
            <Link
              to="/"
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              MainosMestari
            </Link>
          </li>
          <li>
            <Link
              to="/stability"
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Stability
            </Link>
          </li>
          <li>
            <Link
              to="/stability2"
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Stability2
            </Link>
          </li>
        </ul>
      </nav>

      <main className="pt-20 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stability" element={<StabilityForm />} />
          <Route path="/stability2" element={<ImageUploader />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
