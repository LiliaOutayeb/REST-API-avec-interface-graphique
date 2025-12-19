Dans ce travail, il nous a été demandé de créer une API REST avec Express pour gérer des personnes et des villes,
avec la possibilité de récupérer, filtrer, trier et modifier les données en mémoire, 
et de pouvoir mettre les données dans des fichiers.

Etapes suivies pour realiser le travail

Installer Node.js et npm.
Placer les données dans data.js (exportés comme module.exports = { persons, cities }).
Démarrer le serveur:node app.js
Accéder aux endpoints via http://localhost:NUMERO DE PORT.
Mise en place d’un serveur Express sur le port 5001.
Importation des données require("./data") et sauvegarde des données dans data.js .



Endpoints/opérations principaux/principales:

GET /: message de bienvenue, utilisé comme test seulement.
GET /stats: retourne le nombre de personnes et de villes.
GET /persons: liste de personnes avec options de filtrage (name, city), tri (sort) et réduction de champs (fields et cityFields).
GET /persons/:id: détail d’une personne.
GET /cities et GET /cities/:id: liste et détail des villes.
POST /persons et POST /cities: ajout d’une personne ou d’une ville.
DELETE /persons/:id et DELETE /cities/:id: suppression.
PATCH /persons/:id: modification d’un nom et gestion des villes associées (addCityId, removeCityId).
Persistance des données avec persistData qui réécrit data.js après modification.

Notes:

Le endpoint /persons accepte des paramètres query suivants: name, city, sort, fields, cityFields.
Le body des requêtes PATCH et POST est en JSON (app.use(express.json()) est actif).
Les modifications sont sauvegardées dans data.js par persistData après chaque opération.