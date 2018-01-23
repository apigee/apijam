const express = require('express'),
  Promise = require('bluebird'),
  fetch = require('node-fetch');

const app = express();
const routeURL = 'http://maps.googleapis.com/maps/api/directions/json';
const yqlURL = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
const weatherQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="@LOCATION@") and u="c"';


/*
 * Fetch routing info passed in as query parameters
 */
function getRoute(from,to)  {
  let url = `${routeURL}?origin=${from}&destination=${to}`;
  console.log('About to fetch: ', url);
  return fetch( url )
    .then( d => d.json() )
}

/*
 * Fetch weather info for the given location
 */
function getWeather(location)  {
  let query = encodeURIComponent( weatherQuery.replace('@LOCATION@',location) );
  let url = `${yqlURL}&q=${query}`;
  console.log('About to fetch weather: ', url);
  return fetch( url )
    .then( d => d.json() )
}

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/weather/:location', (req, res) => {
  getWeather(  req.params.location ) 
    .then( d => {
      res.status(200).json(d).end();
    });
});

app.get('/route', (req, res) => {
  Promise.join(
    getWeather( req.param('from') ),
    getWeather( req.param('to') ),
    getRoute( req.param('from'), req.param('to') ),
    (wFrom,wTo,route) => {
      route.startWeather = wFrom.query.results.channel.item.condition;
      route.endWeather = wTo.query.results.channel.item.condition;
      return route;
    })
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
