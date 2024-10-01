import { useState } from 'react';

const DallE3Form = () => {

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageRender = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/adds/image", {
        method: "GET",
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log(data);
      setImageUrl(data[0].url);
    } catch (error) {
      console.error("Error fetching the image:", error);
    } finally {
      setLoading(false); // Piilotetaan latausviesti, kun kuvan haku on valmis
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div>
      <h1>Dall-E 3</h1>
      <button onClick={handleImageRender}>Lataa kuva</button>

      {loading && <p>Loading image...</p>}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Fetched from backend" style={{ maxWidth: '300px' }} onLoad={handleImageLoad}/>
        </div>
      )}
    </div>
  );
}

export default DallE3Form;
