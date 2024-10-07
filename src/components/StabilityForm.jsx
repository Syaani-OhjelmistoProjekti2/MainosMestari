import { useState, useRef } from 'react';

const StabilityForm = () => {
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setImageUrl('');
    if (!selectedImage || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("img", selectedImage);
    formData.append("prompt", description);

    try {
      const response = await fetch("http://localhost:3001/api/ads/stabilityimg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const base64Image = data.data;

      const imgUrl = `data:image/png;base64,${base64Image}`;
      //setPreviewImgUrl('');
      //setDescription("");
      //setSelectedImage(null);
      setImageUrl(imgUrl);

     // if (fileInputRef.current) {
      //  fileInputRef.current.value = null;
     // }
  
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      alert("Tapahtui virhe.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  }

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "stability.png";
    link.click();
  };

  return (
    <div>
      <h1>Stability AI Form</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          cols={50}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Syötä kuvaus Stability AI:lle"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
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
        
        <button type="submit" className="buttoni">
          Submit
        </button>
      </form>

      {loading && <p>Loading image...</p>}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Vastaanotettu kuva" style={{ maxWidth: '300px' }} onLoad={handleImageLoad}/>
          <button className='buttoni' onClick={downloadImage}>Lataa kuva</button>
        </div>
      )}
    </div>
  );
};

export default StabilityForm;
