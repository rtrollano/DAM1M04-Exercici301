const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 3000;

// Disable cache
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Continguts estàtics (carpeta public)
app.use(express.static('public'))

// Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar "Helpers .hbs" aquí
hbs.registerHelper('lte', (a, b) => a <= b);

// Partials de Handlebars
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Route
app.get('/', (req, res) => {
  const site = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8')
  );

  data = {
    site: site
  }

  res.render('index', data);
});

app.get('/informe', (req, res) => {

  // Legim els fitxers JSON
  const site = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8')
  );
  const cities = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8')
  );
  const countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'countries.json'), 'utf8')
  );

  // Preparem les dades per a la plantilla
  data = {
    site: site,
    cities: cities.cities,
    countries: countries.countries
  }

  // Renderitza la plantilla informe.hbs
  res.render('informe', data);
});

// Start server
const httpServer = app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log(`http://localhost:${port}/informe`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  httpServer.close();
  process.exit(0);
});
