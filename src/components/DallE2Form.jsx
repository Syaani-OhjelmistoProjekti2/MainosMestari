import { useState } from 'react';

const DallE2Form = () => {
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
    } finally {
      setLoading(false); // Lopeta latausindikaattorin näyttäminen
    }
  };
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div>
      <h1>Dall-E 2</h1>
      <form onSubmit={handleButtonPress}>
        <textarea
          name="description"
          rows={4}
          cols={50}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Syötä kuvaus DALL-E 2:lle"
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

        <button type="submit" style={{ marginTop: '100px' }}>
                Submit
        </button>
      </form>

      {loading && <p>Loading image...</p>}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Fetched from backend" style={{ maxWidth: '300px' }} onLoad={handleImageLoad}/>
        </div>
      )}
    </div>
  );
};

export default DallE2Form;
