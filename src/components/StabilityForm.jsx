import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ImageUploader() {
  //const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const [images, setImages] = useState([]); // Stores uploaded images
  const [description, setDescription] = useState(""); // User-provided description
  const [loading, setLoading] = useState(false); // Loading state indicator
  const [imageUrl, setImageUrl] = useState(""); // Stores the generated image URL
  const fileInputRef = useRef(null); // Reference to file input
  const [isAdText, setisAdText] = useState(false); // Switch state for ad prompt
  const [showOptions, setShowOptions] = useState(false); // Switch state for additional options
  const [selectedOptions, setSelectedOptions] = useState([]); // Tracks selected checkbox options
  const [adText, setAdText] = useState(""); // adtext

  const handleOptionChange = (event) => {
    const { value, checked } = event.target;

    setSelectedOptions((prev) => {
      if (checked) {
        return [...prev, value]; // Add selected option
      } else {
        return prev.filter((option) => option !== value); // Remove unselected option
      }
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  // Removes an image from the list by index
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handles drag-and-drop image upload
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setImageUrl("");

    // Validation, ensure there are images and description
    if (!images.length || !description) {
      alert("Täytä molemmat kentät!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("img", images[0].file); // Only send the first image
    formData.append("prompt", description);

    // Append selected options to formData


    try {
      // Send form data to backend API
      const response = await fetch(`/api/ads/stabilityimg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const base64Image = data.data;
      const imgUrl = `data:image/png;base64,${base64Image}`; // Construct image URL

      if (isAdText) {
        const formDataText = new FormData();
        formDataText.append("img", images[0].file); // Only send the first image
        selectedOptions.forEach((option) => {
          formDataText.append("viewPoints", option);
        });

        const response = await fetch(`/api/ads/getadtext`, {
          method: "POST",
          body: formDataText,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAdText(data.adText);
      }
     
      setImageUrl(imgUrl); // Update image URL state with received image
    } catch (error) {
      console.error("Virhe lähetyksessä:", error);
      alert("Tapahtui virhe.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Stop loading once image has fully loaded in the component
  const handleImageLoad = () => {
    setLoading(false);
  };

  // Downloads the generated image
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "stability.png"; // Default download name
    link.click();
  };

  // Toggle state for ad prompt switch
  const onCheckedChange = (isAdText) => {
    setisAdText(isAdText);
    console.log(isAdText);
  };

  // Render UI
  return (
    <div
      className="w-full h-full flex justify-center items-center"
      style={{ width: "100%", height: "100%" }}
    >
      <Card
        className="w-full h-full max-w-4xl max-h-screen"
        style={{ width: "100%", height: "100%", padding: 100 }}
      >
        <CardHeader>
          <CardTitle>Stability AI Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the type of advertisement image you want the AI to create"
              style={{
                resize: "none",
                width: "100%",
                height: "100px",
                border: "1px solid #ccc", // Raja ympärille
                borderRadius: "4px", // Pyöristetyt kulmat
                padding: "8px", // Tyhjää sisältöön
              }}
            />
            <div
              className="border-2 border-dashed border-zinc-200 rounded-lg p-4 dark:border-zinc-800"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex items-center justify-center space-x-2">
                <UploadIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                <p className="text-zinc-500 dark:text-zinc-400">
                  Drag & Drop your images here
                </p>
              </div>
              <div className="text-center mt-2">
                <input
                  name="fileInput"
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <label htmlFor="fileInput">
                  <Button
                    as="span"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      fileInputRef.current.click();
                    }}
                  >
                    Or browse files
                  </Button>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Uploaded image ${index + 1}`}
                    className="aspect-square object-cover border border-zinc-200 w-full rounded-lg overflow-hidden dark:border-zinc-800"
                  />
                  <Button
                    variant="ghost"
                    className="absolute top-1 right-1 h-6 w-6 p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="adprompt"
                className="switch"
                checked={isAdText}
                onCheckedChange={onCheckedChange}
              />
              <Label htmlFor="adprompt" className="text-sm">
                Do you want adprompt?
              </Label>
            </div>

            <div className="flex  items-center space-x-2">
              <Switch
                className="switch"
                checked={showOptions}
                onCheckedChange={setShowOptions}
              />
              <span>Show additional options</span>
            </div>

            {showOptions && (
              <div className="flex flex-col space-y-2 mt-4">
                {/* Additional options can be added here */}
                <label>
                  <input 
                  type="checkbox"
                  value="kestavyys"
                  onChange={handleOptionChange} /> Kestävyys & laadukkuus
                </label>
                <label>
                  <input
                   type="checkbox"
                   value="korjattavuus"
                   onChange={handleOptionChange} /> Korjattavuus
                </label>
                <label>
                  <input
                   type="checkbox"
                   value="huollettavuus"
                   onChange={handleOptionChange} /> Huollettavuus
                </label>
                <label>
                  <input 
                  type="checkbox"
                  value="paivitettavyys"
                  onChange={handleOptionChange} /> Päivitettävyys
                </label>
                <label>
                  <input 
                  type="checkbox"
                  value="kierratettavyys"
                  onChange={handleOptionChange} /> Säilyttää arvon (kierrätettävyys)
                </label>
              </div>
            )}

            <Button type="submit" className="buttoni">
              Submit
            </Button>
          </form>

          {loading && <p>Loading image...</p>}

      
        </CardContent>
      </Card>

      {imageUrl && (
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <img
                src={imageUrl}
                alt="Vastaanotettu kuva"
                className="max-w-full h-auto rounded-lg mx-auto"
                onLoad={handleImageLoad}
              />
              {adText && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{adText}</p>
              )}
              <Button onClick={downloadImage} className="w-full">
                Lataa kuva
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
