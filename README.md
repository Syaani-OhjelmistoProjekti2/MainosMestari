# MainosMestari
## Johdanto
- Tehtävänä on kehittää webbisovellus, jonka avulla 2nd hand -kalusteiden kauppias voi tuottaa tekoälyä
hyödyntäen kiertotaloushenkisiä mainoksia (esim. yritys- ja tuotemainokset) someen (esim. TikTok, IG,
Facebook).
Product backlog löytyy täältä: https://github.com/orgs/Syaani-OhjelmistoProjekti2/projects/2
## Järjestelmän määrittely
### Sovelluksen tärkeimmät ominaisuudet
- Webbisivu, jossa voidaan määritellä suuntaviivat mainokselle (tekoälylle promptina kuvaa, tekstiä ja/tai saneluja)
- Mahdollisuus valita somekanava, johon mainos on tarkoitettu 
- Mahdollisuus määritellä mainoksen kiertotalouden näkökulma
- Tekoäly tuottaa mainoksen ”räätälöidysti” valittuun kanavaan
- Mahdollisuus ladata mainos omalla koneelle/suoraan someen

## Käyttöliittymä

## Tietokanta
## Tekninen kuvaus
# Web-sovelluksen tekninen kuvaus

## 1. Frontend
- **Käytetty teknologia**: React + Vite
- **Kuvaus**: Frontend on toteutettu käyttäen React-kirjastoa ja Viteä kehitysympäristönä. React mahdollistaa komponenttipohjaisen arkkitehtuurin ja tehokkaan tilanhallinnan. Vite tarjoaa nopean kehitysympäristön sekä optimoi sovelluksen tuotantoversiot.
  
- **Keskeiset ominaisuudet**:
  - **Komponenttipohjainen rakenne**: React-komponenttien uudelleenkäyttö ja modulaarisuus helpottavat koodin ylläpitoa ja laajennettavuutta.
  - **Tilanhallinta**: Sovelluksen tila hallitaan Reactin omien tilahallintamenetelmien (useState, useEffect) avulla.
  - **Reititys**: React Router vastaa sovelluksen eri näkymien lataamisesta ja reitityksestä.

- **Build- ja kehitystyökalut**:
  - **Vite**: Vite takaa nopean kehitysympäristön ja optimoi sovelluksen tuotantokäyttöön. 

## 2. Backend
- **Käytetty teknologia**: Node.js + Express.js
- **Kuvaus**: Backend on toteutettu Node.js:llä ja Express.js-sovelluskehyksellä. Node.js:n avulla JavaScriptia voidaan käyttää palvelinpuolella, ja Express mahdollistaa kevyiden ja joustavien REST API -rajapintojen rakentamisen.

- **Keskeiset ominaisuudet**:
  - **RESTful API**: Backend tarjoaa REST API -rajapinnat, joita frontend käyttää kommunikoidakseen palvelimen kanssa. API tukee CRUD-toimintoja.
  - **Tietokantaintegraatio**: Node.js integroituu käytettävään MongoDB-tietokantaan. ORM-työkaluna käytetään Mongoosea.
  - **Middleware**: Express.js:n avulla käytetään middleware-komponentteja.
  - **Asynkroninen ohjelmointi**: Node.js:n asynkroniset ominaisuudet mahdollistavat tehokkaan I/O-käsittelyn, kuten tietokantakyselyt ja API-kutsut.

## 3. DALLE-3 integraatio
- **Käytetty tekoälymalli**: DALLE-3
- **Kuvaus**: Sovelluksessa on integroitu OpenAI:n DALLE-3-malli, joka mahdollistaa kuvan generoinnin luonnollisella kielellä annettujen tekstikuvauksien perusteella. Malli on yhdistetty backend-puolelle, ja se tarjoaa kuvanluontitoiminnon käyttäjän määrittelemien syötteiden perusteella.

- **Keskeiset ominaisuudet**:
  - **Tekstistä kuvaksi -generointi**: Sovellus mahdollistaa käyttäjien luoda kuvia tekstikuvauksien perusteella käyttäen DALLE-3-mallia. Käyttäjä voi syöttää tekstin frontendin kautta, ja backend kutsuu DALLE-3-mallia kuvan luomiseksi.
  - **API-yhteys**: DALLE-3-mallia hyödynnetään kutsumalla OpenAI:n APIa backendin kautta, ja generoidut kuvat välitetään takaisin frontendille esitettäväksi.


## 4. Tietoturva ja suorituskyky
- **CORS-suojaus**: CORS-käytännöt on määritetty hallitsemaan palvelimen ja frontendin välistä liikennettä.


## Testaus
## Asennustiedot
## Käynnistys- ja käyttöohje
## Jäsenet
Mikko Särkiniemi, Pinja Tirkkonen, Chak-Fung Tsang, Artur Golubev, Joni Tirkkonen
