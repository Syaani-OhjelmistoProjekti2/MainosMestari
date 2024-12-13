import "./App.css";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <main className="h-screen overflow-y-auto">
      <Header />
      <ImageUploader />
    </main>
  );
}

export default App;
