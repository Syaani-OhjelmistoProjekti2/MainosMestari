import { useState } from "react";


const StabilityForm = () => {

    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);


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
       <div>
      <h1>Stability AI</h1>
      <button onClick={handleStabilityAi}>Lataa kuva</button>

      {loading && <p>Loading image...</p>}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Fetched from backend" style={{ maxWidth: '300px' }} onLoad={handleImageLoad} />
        </div>
      )}
    </div>
  );
}

export default StabilityForm;