const express = require('express'),
  fetch = require('node-fetch');

const app = express();
const routeURL = 'http://maps.googleapis.com/maps/api/directions/json';

/*
 * Fetch routing info passed in as query parameters
 */
function getRoute(from,to)  {
  let url = `${routeURL}?origin=${from}&destination=${to}`;
  console.log('About to fetch: ', url);
  return fetch( url )
    .then( d => d.json() )
}

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/route', (req, res) => {
  getRoute( req.param('from'), req.param('to') ) 
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
