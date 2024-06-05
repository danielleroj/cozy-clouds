const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.OPENWEATHER_API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";
const geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct";

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(location) {
    try {
        const geoResponse = await axios.get(geoApiUrl, {
            params: {
                q: location,
                limit: 1,
                appid: apiKey,
            },
        });

        if (geoResponse.data.length === 0) {
            throw new Error("Location not found");
        }

        const { lat, lon, name } = geoResponse.data[0];

        const weatherResponse = await axios.get(apiUrl, {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: "imperial",
            },
        });

        const { main, weather } = weatherResponse.data;
        const temperature = main.temp;
        const description = weather[0].description;
        const icon = weather[0].icon;

        return { name, temperature, description, icon };
    } catch (err) {
        throw new Error("Error fetching weather data");
    }
}

async function fetchWeatherDataByCoords(lat, lon) {
    try {
        const weatherResponse = await axios.get(apiUrl, {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: "imperial",
            },
        });

        const { main, weather, wind, visibility, sys, name } =
            weatherResponse.data;

        return { name, main, weather, wind, visibility, sys };
    } catch (err) {
        throw new Error("Error fetching weather data");
    }
}

async function fetchWeatherForecast(location) {
    try {
        const geoResponse = await axios.get(geoApiUrl, {
            params: {
                q: location,
                limit: 1,
                appid: apiKey,
            },
        });

        if (geoResponse.data.length === 0) {
            throw new Error("Location not found");
        }

        const { lat, lon } = geoResponse.data[0];

        const forecastResponse = await axios.get(forecastApiUrl, {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: "imperial",
            },
        });

        const forecastData = forecastResponse.data.list;
        const dailyForecast = {};

        forecastData.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = [];
            }
            dailyForecast[date].push(entry);
        });

        const limitedForecast = Object.keys(dailyForecast)
            .slice(0, 5)
            .reduce((result, key) => {
                result[key] = dailyForecast[key];
                return result;
            }, {});

        return limitedForecast;
    } catch (err) {
        throw new Error("Error fetching forecast data");
    }
}

module.exports = {
    fetchWeatherData,
    fetchWeatherForecast,
    fetchWeatherDataByCoords,
};
