import { useEffect, useState } from "react";
import * as userService from "../../utilities/users-service";
import Collapsible from "../../components/Collapsible/Collapsible";

const getIconUrl = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}.png`;

export default function Dashboard() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await userService.getUser();
                setUser(userData);
            } catch (err) {
                setError("Error fetching user data");
            }
        };
        const fetchCurrentLocationWeather = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const apiUrl = process.env.REACT_APP_API_URL;
                            const response = await fetch(
                                `${apiUrl}/api/weather/current?lat=${latitude}&lon=${longitude}`
                            );
                            if (!response.ok)
                                throw new Error("Error fetching data");
                            const data = await response.json();
                            setWeather(data);
                            setError("");
                        } catch (err) {
                            setError("Error fetching weather data");
                        } finally {
                            setLoading(false);
                        }
                    },
                    () => {
                        setError("Error getting location");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation not supported");
                setLoading(false);
            }
        };

        fetchUserData();
        fetchCurrentLocationWeather();
    }, []);

    return (
        <div className="weather">
            <h1>Welcome, {user ? user.name : "Guest"}</h1>
            <br />
            <h2>Current Location Weather</h2>
            {loading && <p>Searching for your location...</p>}
            {error && <p>{error}</p>}
            {weather && (
                <div>
                    <h3>📍{weather.name}</h3>
                    <p>Temperature: {weather.main.temp}°F</p>
                    <p className="current-condition-icon">
                        Condition: {weather.weather[0].description}
                        <img
                            src={getIconUrl(weather.weather[0].icon)}
                            alt={weather.weather[0].description}
                            className="current-weather-icon"
                        />
                    </p>
                    <Collapsible title="More Info">
                        <p>Feels Like: {weather.main.feels_like}°F</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>
                            Wind: {weather.wind.speed} mph at {weather.wind.deg}°
                        </p>
                        <p>Pressure: {weather.main.pressure} hPa</p>
                        <p>Visibility: {weather.visibility} meters</p>
                        <p>
                            Sunrise:{" "}
                            {new Date(
                                weather.sys.sunrise * 1000
                            ).toLocaleTimeString()}
                        </p>
                        <p>
                            Sunset:{" "}
                            {new Date(
                                weather.sys.sunset * 1000
                            ).toLocaleTimeString()}
                        </p>
                    </Collapsible>
                </div>
            )}
        </div>
    );
}