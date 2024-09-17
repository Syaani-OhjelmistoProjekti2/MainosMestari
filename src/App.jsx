import { useState } from 'react';
import './App.css';

function App() {
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");

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

  // Kuvan ja descriptionin lähettäminen
  const handleButtonPress = async (event) => {
    event.preventDefault();

    if (!selectedImage || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage); // Lisätään kuva
    formData.append("description", description); // Lisätään description-teksti

    try {
      const response = await fetch("http://localhost:3001/api/adds/image", { // post pyyntö
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Data lähetetty onnistuneesti!");
        // Tyhjennetään lomake
        setPreviewImgUrl("");
        setDescription("");
        setSelectedImage(null);
      } else {
        alert("Lähetys epäonnistui.");
      }
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      alert("Tapahtui virhe.");
    }
  };

  const handleImageRender = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/adds/image", {
        method: "GET"
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  }    

  return (
    <>
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
      </form>
    </>
  );
}

export default App;
