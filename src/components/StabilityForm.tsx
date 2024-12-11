// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";

export default function ImageUploader() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const [images, setImages] = useState([]); // Stores uploaded images
  const [description, setDescription] = useState(""); // User-provided description
  const [loading, setLoading] = useState(false); // Loading state indicator
  const [imageUrl, setImageUrl] = useState(""); // Stores the generated image URL
  const fileInputRef = useRef(null); // Reference to file input
  const [isAdText, setisAdText] = useState(false); // Switch state for ad prompt
  const [selectedOptions, setSelectedOptions] = useState([]); // Tracks selected checkbox options
  const [adText, setAdText] = useState(""); // adtext
  const [isCopied, setIsCopied] = useState(false);

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
    const file = event.target.files[0];
    const imageFile = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages([imageFile]); // Replace the current image with the new one
  };
  // Removes an image from the list by index
  const handleRemoveImage = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Handles drag-and-drop image upload
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const imageFile = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages([imageFile]); // Replace the current image with the new one
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setImageUrl("");
    setAdText("");

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
      const response = await fetch(`${apiUrl}/api/ads/stabilityimg`, {
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

        const response = await fetch(`${apiUrl}/api/ads/getadtext`, {
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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(adText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Palautetaan alkuperäinen tila 2 sekunnin kuluttua
      })
      .catch((err) => {
        console.error("Kopiointi epäonnistui:", err);
      });
  };

  // Render UI
  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <Card
        className="w-full max-w-4xl flex flex-col space-y-4 p-6"
        style={{ paddingLeft: 100, paddingRight: 100 }}
      >
        <CardHeader>
          <CardTitle>Stability AI 1 Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kuvaile millaisen mainoskuvan haluat tekoälyn luovan" // Describe the type of advertisement image you want the AI to create
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
                  Vedä ja pudota kuva tänne {/*Drag & Drop your image here */}
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
                    Tai selaa tiedostoja {/* Or browse files */}
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Uploaded image ${index + 1}`}
                    className="aspect-square object-contain border border-zinc-200 w-full rounded-lg overflow-hidden dark:border-zinc-800"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <Button
                    variant="ghost"
                    className="absolute top-1 right-1 h-6 w-6 p-1 custom-button"
                    onClick={handleRemoveImage}
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
                Generoi mainosteksti
              </Label>
            </div>

            {isAdText && (
              <div className="flex flex-col space-y-2 mt-4">
                <h2 className="font-bold">Kiertotalousnäkökulma</h2>
                {/* Additional options can be added here */}
                <label>
                  <input
                    type="checkbox"
                    value="durability"
                    onChange={handleOptionChange}
                  />{" "}
                  Kestävyys & laadukkuus
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="repairability"
                    onChange={handleOptionChange}
                  />{" "}
                  Korjattavuus
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="maintainability"
                    onChange={handleOptionChange}
                  />{" "}
                  Huollettavuus
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="upgradability"
                    onChange={handleOptionChange}
                  />{" "}
                  Päivitettävyys
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="recyclability"
                    onChange={handleOptionChange}
                  />{" "}
                  Säilyttää arvon (kierrätettävyys)
                </label>
              </div>
            )}

            <Button type="submit" className="buttoni">
              Generoi mainos {/* Generate AD */}
            </Button>
          </form>

          {loading && <p>Ladataan kuvaa...</p>}
        </CardContent>
      </Card>

      {imageUrl && (
        <Card className="w-full max-w-4xl" style={{ marginLeft: 10 }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <img
                src={imageUrl}
                alt="Vastaanotettu kuva"
                className="max-w-full h-auto rounded-lg mx-auto"
                onLoad={handleImageLoad}
              />
              {adText && (
                <form className="relative">
                  {/* Tekstikenttä */}
                  <textarea
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)} // Lisää onChange, jos haluat päivittää tekstin
                    style={{
                      resize: "none",
                      width: "100%",
                      height: "500px",
                      border: "1px solid #ccc", // Raja ympärille
                      borderRadius: "4px", // Pyöristetyt kulmat
                      padding: "8px", // Tyhjää sisältöön
                      paddingTop: "40px", // Varmistetaan, että nappi ei peitä tekstiä
                    }}
                  />
                  {/* Kopioi-nappi tekstikentän oikeassa yläkulmassa */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black text-gb-700 p-2 hover:bg-gray-500 transition-all border border-gray-300 rounded-md shadow-md hover:shadow-lg"
                    onClick={handleCopy}
                    style={{
                      width: "20px", // Napin leveys
                      height: "10px", // Napin korkeus, korjattu arvo (aiempi oli liian pieni)
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px", // Kulmat pyöristetään vain vähän
                    }} // Napin koko
                  >
                    {isCopied ? (
                      <>
                        <CheckmarkIcon className="w-6 h-6 mx-auto text-white" />
                      </>
                    ) : (
                      <CopyIcon className="w-6 h-6 mx-auto text-white" /> // Kopiointi-ikoni
                    )}
                  </button>
                </form>
              )}

              <Button onClick={downloadImage} className="buttoni">
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
function CopyIcon(props) {
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
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"
      />
    </svg>
  );
}

function CheckmarkIcon(props) {
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
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
