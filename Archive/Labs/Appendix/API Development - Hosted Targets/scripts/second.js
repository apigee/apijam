const express = require('express'),
  fetch = require('node-fetch'),
  key = require('./mapquestKey');

const app = express();
//const routeURL = 'http://maps.googleapis.com/maps/api/directions/json';
const routeURL = 'https://www.mapquestapi.com/directions/v2/route';

/*
 * Fetch routing info passed in as query parameters
 */
function getRoute(from,to)  {
  let url = `${routeURL}?from=${from}&to=${to}&key=${key.key}`;
  console.log('About to fetch: ', url);
  return fetch( url )
    .then( d => d.json() )
    //.then( route => route.routes[0].legs[0] )
    .then( route => route.route.legs[0] )
}

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/route', (req, res) => {
  getRoute( req.query.from, req.query.to ) 
    .then( d => {
      res.status(200).json(d).end();
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
