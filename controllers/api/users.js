const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { fetchWeatherData } = require("../../src/utilities/weather-service");

module.exports = {
    create,
    login,
    getWeather,
    saveLocation,
    deleteLocation,
    getSavedLocations,
};

async function create(req, res) {
    try {
        const user = await User.create(req.body);
        const token = createJWT(user);
        console.log("Generated Token:", token);
        const weatherData = await fetchWeatherData("New York");
        res.json({ token, weatherData });
    } catch (err) {
        console.error("Error during user creation:", err);
        res.status(400).json("Bad Credentials");
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error();
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new Error();
        const token = createJWT(user);
        console.log("Generated Token:", token);
        const weatherData = await fetchWeatherData("New York");
        res.json({ token, weatherData });
    } catch (err) {
        res.status(400).json("Bad Credentials");
    }
}

async function getWeather(req, res) {
    try {
        const weatherData = await fetchWeatherData(req.params.location);
        res.json(weatherData);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function saveLocation(req, res) {
    try {
        const user = await User.findById(req.user._id);
        user.locations.push(req.body.location);
        await user.save();
        res.json(user.locations);
    } catch (err) {
        res.status(400).json("Error saving location");
    }
}

async function deleteLocation(req, res) {
    try {
        const user = await User.findById(req.user._id);
        user.locations = user.locations.filter(
            (loc) => loc !== req.params.location
        );
        await user.save();
        res.json(user.locations);
    } catch (err) {
        res.status(400).json("Error deleting location");
    }
}

async function getSavedLocations(req, res) {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.locations);
    } catch (err) {
        res.status(400).json("Error fetching saved location");
    }
}

/*--- Helper Functions --*/

function createJWT(user) {
    return jwt.sign(
        // data payload
        { user },
        process.env.SECRET,
        { expiresIn: "24h" }
    );
}
