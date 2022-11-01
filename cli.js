#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

//Arguments
if (args.h) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -t TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -t            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

//TimeZone
var timezone = moment.tz.guess();

//Latitude and Longitude
var latitude;
var longitude;

if (args.n && !args.s) {
	latitude = args.n;
}
else if (args.s && !args.n) {
	latitude = args.s * -1;
}
else{
	if(latitude == 0.0)
		console.log("Using default latitude");
	else{
		console.log("Latitude must be in range");
		process.exit(0);
	}
}
if (args.w && !args.e) {
	longitude = args.w * -1;
}
else if (args.e && !args.w) {
	longitude = args.e;
}
else{
	if(longitude == 0)
		console.log("Using default longitude");
	else{
		console.log("Longitude must be in range");
		process.exit(0);
	}
}
if (args.t) {
    timezone = args.t;
}
timezone.replace("/", "%2");

//Fetch Request and Get Data
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
const data = await response.json();

//Return JSON
if (args.j) {
	console.log(data);
	process.exit(0);
}

//Days
const days = args.d;

if (data.daily.precipitation_hours[days] == 0) {
	console.log("You will not need your galoshes")
} 
else if(data.daily.precipitation_hours[days] != 0) {
	console.log("You might need your galoshes")
}
if (days == 0) {
	console.log(" today.")
} else if (days > 1) {
    console.log(" in " + days + " days.")
} else {
    console.log(" tomorrow.")
}
process.exit(0);
