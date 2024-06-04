const {
    fetchWeatherData,
    fetchWeatherForecast,
    fetchWeatherDataByCoords,
} = require("../../src/utilities/weather-service");

module.exports = {
    getWeather,
    get5DayForecast,
    getWeatherForMultipleLocations,
    getWeatherByCoords,
};

async function getWeather(req, res) {
    try {
        const weatherData = await fetchWeatherData(req.params.location);
        res.json(weatherData);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function get5DayForecast(req, res) {
    try {
        const forecastData = await fetchWeatherForecast(req.params.location);
        res.json(forecastData);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getWeatherForMultipleLocations(req, res) {
    const { locations } = req.body;
    try {
        const weatherDataPromises = locations.map((location) =>
            fetchWeatherData(location)
        );
        const weatherData = await Promise.all(weatherDataPromises);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching weather data for multiple locations",
        });
    }
}

async function getWeatherByCoords(req, res) {
    const { lat, lon } = req.query;
    try {
        const weatherData = await fetchWeatherDataByCoords(lat, lon);
        res.json(weatherData);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}
