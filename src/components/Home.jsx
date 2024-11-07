import { Button } from "./ui/button";
import { Link } from 'react-router-dom';


function Home() {
    return (
      <div>
        <h1>Create stunning ad images in an instant</h1>
        <p>

          Welcome to our app, which uses AI to generate professional advertisement images for your furniture. 
          With our easy-to-use platform, you can upload your own image and define the style and mood of the ad. 
          The AI takes care of the rest, delivering high-quality images in the environment and visual style you desire.
          </p>

        {/* Nappilinkki Stability-sivulle */}
      <Link to="/stability">
        <Button>Create Your Ad Image</Button>
      </Link>
      </div>
    );
  }

  export default Home;

  