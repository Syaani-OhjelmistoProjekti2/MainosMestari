import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DallE2Form from './components/DallE2Form';
import DallE3Form from './components/DallE3Form';
import StabilityForm from './components/StabilityForm';
import './App.css';

function FormPage() {
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file); 

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonPress = async (event) => {
    event.preventDefault();

    if (!selectedImage || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("img", selectedImage);
    formData.append("prompt", description);

    try {
      const response = await fetch("http://localhost:3001/api/adds/image", { 
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        alert("Data lähetetty onnistuneesti!");
        setPreviewImgUrl("");
        setDescription("");
        setSelectedImage(null);
        const data = await response.json();
        setImageUrl(data[0].url);
      }
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      alert("Tapahtui virhe.");
    }
  };

  const handleImageRender = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/adds/image", {
        method: "GET"
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log(data);
      setImageUrl(data[0].url);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  const handleStabilityAi = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/adds/stabilityimg');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const binaryLen = atob(data.data);
      const bytes = new Uint8Array(binaryLen.length);
      for (let i = 0; i < binaryLen.length; i++) {
        bytes[i] = binaryLen.charCodeAt(i);
      }
  
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
      
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <form>
      <textarea
        name="description"
        rows={4}
        cols={50}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {previewImgUrl && (
        <div className="container">
          <img
            src={previewImgUrl}
            alt="Selected"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              objectFit: 'contain',
              textAlign: 'center',
            }}
          />
        </div>
      )}

      <button className="buttoni" onClick={handleButtonPress}>
        Submit
      </button>

      <button className="buttoni2" onClick={handleImageRender}>
        Image
      </button>

      <button className="buttoni3" onClick={handleStabilityAi}>
        Stability AI
      </button>

      <div>
        {loading && <p>Loading image...</p>}

        {imageUrl && (
          <img src={imageUrl} alt="Fetched from backend" onLoad={handleImageLoad} />
        )}
      </div>
    </form>
  );
}

function App() {
  return (
    <Router>
      <div>
        {/* Navigointilinkit */}
        <nav>
          <ul>
            <li>
              <Link to="/form">Form</Link>
            </li>
            <li>
              <Link to="/dall-e-2">DALL-E 2</Link>
            </li>
            <li>
              <Link to="/dall-e-3">DALL-E 3</Link>
            </li>
            <li>
              <Link to="/stability">Stability</Link>
            </li>
          </ul>
        </nav>

        {/* Reititys */}
        <Routes>
          <Route path="/form" element={<FormPage />} />
          <Route path="/dall-e-2" element={<DallE2Form />} />
          <Route path="/dall-e-3" element={<DallE3Form />} />
          <Route path="/stability" element={<StabilityForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
