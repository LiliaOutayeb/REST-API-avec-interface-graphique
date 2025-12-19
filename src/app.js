const express = require("express");
const { persons, cities } = require("./data");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;

//Chemin vers le fichier data.js pour sauvegarder les données
const pathData = path.join(__dirname, "data.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sauvegarde les tableaux persons et cities dans le fichier data.json
function persistData() {
  const fileContent = `let persons = ${JSON.stringify(persons, null, 2)};
let cities = ${JSON.stringify(cities, null, 2)};
module.exports = { persons, cities };
`;
  fs.writeFileSync(pathData, fileContent, "utf8");
}

app.get("/persons", (req, res) => {
  console.log("GET PERSONS EN EXECUTION");
  let result = [...persons];

  // Filtrer par nom
  if (req.query.name) {
    const name = req.query.name.toLowerCase();
    result = result.filter(
      (p) => p.name && p.name.toLowerCase().includes(name)
    );
  }

  // Selecting des champs spécifié
  const fields = req.query.fields ? req.query.fields.split(",") : null;
  const cityFields = req.query.cityFields
    ? req.query.cityFields.split(",")
    : null;

  result = result.map((p) => {
    let obj = {};

    //de la personne
    if (fields) {
      fields.forEach((f) => {
        if (f !== "cities" && p[f] !== undefined) obj[f] = p[f];
      });
    } else {
      obj = { ...p };
    }

    //Champs des villes
    if (p.cities && cityFields) {
      obj.cities = p.cities.map((c) => {
        let cityObj = {};
        cityFields.forEach((f) => {
          if (c[f] !== undefined) cityObj[f] = c[f];
        });
        return cityObj;
      });
    } else if (p.cities && (!fields || fields.includes("cities"))) {
      obj.cities = p.cities;
    }

    return obj;
  });

  // Trier selon id ou name
  if (req.query.sort) {
    const key = req.query.sort;
    result.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  res.json(result);
});

// Retourne une personne avec son id
app.get("/persons/:id", (req, res) => {
  console.log("GET PERSON BY ID en execution");
  const id = parseInt(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) return res.status(404).json({ message: "Personne non trouvée" });

  res.json(person);
});

//Retourne toutes les villes
app.get("/cities", (req, res) => res.json(cities));

//Retourne une ville par son id
app.get("/cities/:id", (req, res) => {
  console.log("GET CITY BY ID en execution");
  const id = parseInt(req.params.id);
  const city = cities.find((c) => c.id === id);

  if (!city) return res.status(404).json({ message: "Ville non trouvée" });

  res.json(city);
});

//Ajoute une nouvelle personne
app.post("/persons", (req, res) => {
  console.log("POST PERSONS en execution");
  const { id, name, cities: personCities } = req.body;

  if (!name) return res.status(400).json({ error: "Le champ name est requis" });

  const newPerson = {
    id: parseInt(id),
    name,
    cities: Array.isArray(personCities) ? personCities : [],
  };

  persons.push(newPerson);
  persistData();

  res.status(201).json(newPerson);
});

//Ajoute une nouvelle ville
app.post("/cities", (req, res) => {
  console.log("POST CITIES en execution");
  const { id, name, area, population } = req.body;

  if (!name) return res.status(400).json({ error: "Le champ name est requis" });

  const newCity = {
    id,
    name,
    area: area ? Number(area) : 0,
    population: population ? parseInt(population) : 0,
  };

  cities.push(newCity);
  persistData();

  res.status(201).json(newCity);
});

//Supprime une personne par son id
app.delete("/persons/:id", (req, res) => {
  console.log("DELETE PERSON en execution");
  const id = parseInt(req.params.id);
  const index = persons.findIndex((p) => p.id === id);

  if (index === -1)
    return res.status(404).json({ message: "Personne non trouvée" });

  const removed = persons.splice(index, 1)[0];
  persistData();

  res.json(removed);
});

//Supprime une ville
app.delete("/cities/:id", (req, res) => {
  console.log("DELETE CITY en execution");
  const id = parseInt(req.params.id);

  const index = cities.findIndex((c) => c.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Ville non trouvée" });

  const removed = cities.splice(index, 1)[0];

  //Supprimer de la ville chez toute personne
  persons.forEach((p) => {
    if (p.cities) p.cities = p.cities.filter((c) => c.id !== id);
  });

  persistData();
  res.json(removed);
});

//modifier, ajouter,supprimer une ville
app.patch("/persons/:id", (req, res) => {
  console.log("PATCH PERSONS en execution");

  const id = parseInt(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) return res.status(404).json({ error: "Personne non trouvée" });

  //Modifier une ville
  if (req.body.name !== undefined) person.name = req.body.name;

  //Ajouter une ville
  if (req.body.addCityId !== undefined) {
    const cityId = parseInt(req.body.addCityId);
    const city = cities.find((c) => c.id === cityId);

    if (!city) return res.status(400).json({ error: "Ville non trouvée" });

    if (!person.cities) person.cities = [];
    if (!person.cities.find((c) => c.id === cityId))
      person.cities.push({ ...city });
  }

  //supprimer une ville
  if (req.body.removeCityId !== undefined && person.cities) {
    const cityId = parseInt(req.body.removeCityId);
    person.cities = person.cities.filter((c) => c.id !== cityId);
  }

  persistData();
  res.json(person);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
