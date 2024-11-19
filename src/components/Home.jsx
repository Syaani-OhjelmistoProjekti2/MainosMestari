import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Luo upeita mainoskuvia hetkessä</h1>
      <p>
        Tervetuloa sovellukseemme, joka käyttää tekoälyä luodakseen
        ammattilaismaisia mainoskuvia huonekalujesi esittelyyn.
        Helppokäyttöisellä alustallamme voit ladata oman kuvasi ja määritellä
        mainoksen tyylin ja tunnelman. Tekoäly hoitaa loput, luoden
        korkealaatuisia kuvia haluamassasi ympäristössä ja visuaalisessa
        tyylissä.
      </p>

      {/* Nappilinkki Stability-sivulle */}
      <Link to="/stability">
        <Button>Luo mainoskuvasi</Button>
      </Link>
    </div>
  );
}

export default Home;
