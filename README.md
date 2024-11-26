# MainosMestari

## Johdanto

MainosMestari on web-sovellus, joka hyödyntää tekoälyä kiertotaloushenkisten mainosten luomiseen. Sovellus on suunniteltu erityisesti 2nd hand -kalusteiden kauppiaille, mutta sitä voi käyttää laajemmin kiertotalouteen liittyvän markkinoinnin tueksi. 

Sovelluksen avulla käyttäjät voivat määritellä mainoksen suuntaviivat, valita somekanavan ja luoda räätälöidyn mainoksen ladattavaksi tai suoraan jaettavaksi.

Product backlog: [GitHub-projekti](https://github.com/orgs/Syaani-OhjelmistoProjekti2/projects/2)

---

## Tekninen kuvaus

### Frontend
- **Teknologia**: React + Vite
- **Rakenteen kuvaus**:
  - **Komponenttipohjaisuus**: Sovellus hyödyntää modulaarista rakennetta, joka tukee ylläpidettävyyttä ja laajennettavuutta.
  - **Reititys**: React Router hallinnoi sovelluksen näkymiä.
  - **Staattinen tarjoilu**: Frontend rakennetaan tuotantokäyttöön hakemistoon `dist` ja tarjoillaan backendin kautta portista 8080.

### Backend
- **Teknologia**: Node.js + Express
- **Keskeiset ominaisuudet**:
  - RESTful API rajapinnat tiedonsiirtoon frontendin kanssa.
  - Tekoälytoiminnot kuten kuvan- ja tekstinluonti Stability.ai- ja OpenAI-teknologioilla.

### Tekoälymallit
- **Kuvan generointi**: Stability.ai:n inpaint-ominaisuus.
- **Tekstin generointi**: OpenAI:n API, joka luo mainostekstejä kuvan analyysin ja käyttäjän määrittämien näkökohtien perusteella.

### Automaatio ja julkaisu
- Sovellus on julkaistu **CSC:n tarjoamassa Rahti 2 -palvelussa**, joka hyödyntää OpenShiftin konttipohjaista arkkitehtuuria.
- Julkaisussa frontend tarjoillaan staattisesti `dist`-hakemistosta backendin kautta.
- Backend ja frontend toimivat samassa kontissa, ja sovellus on konfiguroitu käyttämään porttia 8080.
- YAML-konfiguraatio määrittää konttien rakennuksen, julkaisut ja webhookit, jotka automatisoivat GitHub-päivitysten julkaisun Rahdissa.

---

## Asennusohjeet

### Tarvittavat työkalut
- Node.js (versio 16 tai uudempi)
- Rahti 2 -palvelu (CSC:n tarjoama)
- API-avaimet Stability.ai ja OpenAI-palveluihin.

### Asennus

1. **Kloonaa projekti**
   ```bash
   git clone https://github.com/Syaani-OhjelmistoProjekti2/MainosMestari-backend.git
   cd MainosMestari-backend
   ```

2. **Asenna riippuvuudet**
   ```bash
   npm install
   ```

3. **Määritä ympäristömuuttujat**
   
   Luo `.env`-tiedosto juurihakemistoon ja lisää seuraavat:
   ```plaintext
   STABILITY_KEY_API=syötä_API_avain
   ```

4. **Rakennus ja käynnistys**

   - **Frontend**
     ```bash
     npm run build
     ```

   - **Backend**
     ```bash
     npm start
     ```

5. **Käynnistä palvelin**
   
   Sovellus on käytettävissä osoitteessa [http://localhost:8080](http://localhost:8080).

---

## Käyttö

### Tekoälytoiminnot
- **Kuvan käsittely**: Kuvan taustan poistaminen ja uuden taustan generointi Stability.ai:n avulla.
- **Mainostekstin luonti**: OpenAI API:n avulla luodaan tekstejä analysoimalla käyttäjän lataamaa kuvaa.

### Esimerkki API-kutsusta

Stability.ai:n inpaint-kutsu:
```javascript
const response = await axios.post(
    'https://api.stability.ai/v2beta/stable-image/edit/inpaint',
    formData,
    { headers: { Authorization: `Bearer ${STABILITY_KEY_API}` } }
);
```

---

## Tietoturva

- **API-avaimet**: Säilytetään `.env`-tiedostossa.
- **CORS**: Hallittu palvelimen ja frontendin välinen liikenne.
- **Konfigurointi**: Varmista, ettei repositoriossa ole API-avaimia tai muita arkaluontoisia tietoja.

---

## Kehityssuunnitelmat
- Lisää API-tukea muille tekoälymalleille.
- Paranna käyttöliittymän saavutettavuutta.
- Laajenna tietoturvaa OWASP Top 10 -haavoittuvuuksia vastaan.

---

## Yhteystiedot
Projektitiimi: Mikko Särkiniemi, Pinja Tirkkonen, Chak-Fung Tsang, Artur Golubev, Joni Tirkkonen.

GitHub-repositorio: [https://github.com/Syaani-OhjelmistoProjekti2/MainosMestari-backend](https://github.com/Syaani-OhjelmistoProjekti2/MainosMestari-backend)

