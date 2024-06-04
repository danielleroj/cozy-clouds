require("dotenv").config();
require("./config/database");

const User = require("./models/user");
const Location = require("./models/location");
const Weather = require("./models/weather");

let user, location, weather;
let users, locations, weathers;
