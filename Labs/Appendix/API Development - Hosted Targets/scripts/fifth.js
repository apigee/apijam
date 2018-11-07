const express = require('express'),
  Promise = require('bluebird'),
  fetch = require('node-fetch'),
  key = require('./mapquestKey');

const app = express();
//const routeURL = 'http://maps.googleapis.com/maps/api/directions/json';
const routeURL = 'https://www.mapquestapi.com/directions/v2/route';
const yqlURL = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
const weatherQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="@LOCATION@") and u="c"';


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

/*
 * Fetch weather info for the given location
 */
function getWeather(location)  {
  let query = encodeURIComponent( weatherQuery.replace('@LOCATION@',location) );
  let url = `${yqlURL}&q=${query}`;
  console.log('About to fetch weather: ', url);
  return fetch( url )
    .then( d => d.json() )
    .then( d => {
      return d;
    } )
    .catch( e => {
      console.error('We received an error and stuff: %s', e.stack );
    } )
}

/*
 * Using the forecast array and arrival date we return that day or null
 * if nothing is found.
 */
function getWeatherForDate( forecast, date ) {
  let arrivalConditions = null;
  forecast.forEach( f => {
    let d = new Date( f.date ).getTime();
    let diff = date - d;
    if ( (diff > 0) && diff < (24*60*60*1000) )  {
      arrivalConditions = f;
    }
  })
  return arrivalConditions;
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
      let totalSeconds = ( 
        (parseInt(route.formattedTime.split(':')[0]) * ( 60*60 )) + 
        (parseInt(route.formattedTime.split(':')[1]) * 60) + 
        (parseInt(route.formattedTime.split(':')[2]) ) 
      );
      route.startWeather = wFrom.query.results.channel.item.condition;
      route.endWeather = getWeatherForDate( wTo.query.results.channel.item.forecast,
        new Date().getTime() + (totalSeconds*1000) )
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
