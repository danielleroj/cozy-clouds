const express = require("express");
const router = express.Router();
const weatherCtrl = require("../../controllers/api/weather");

router.get("/location/:location", weatherCtrl.getWeather);
router.get("/current", weatherCtrl.getWeatherByCoords);
router.get("/5-day-forecast/:location", weatherCtrl.get5DayForecast);
router.post("/multiple", weatherCtrl.getWeatherForMultipleLocations);

module.exports = router;
