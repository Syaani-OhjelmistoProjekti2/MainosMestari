import { Suspense } from "react";
import "./App.css";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import LoadingSpinner from "./components/loaders";

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10 bg-fixed"
        style={{ backgroundImage: 'url("/beautiful-blue-002.jpeg")' }}
      ></div>
      <div className="absolute inset-0 w-full min-h-screen overflow-auto">
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <main className="relative z-10">
            <ImageUploader />
          </main>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
