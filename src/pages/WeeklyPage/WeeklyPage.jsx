import { useState, useCallback } from "react";
import { get5DayForecast } from "../../utilities/weather-api";

const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}.png`;

const filterForecastData = (data, toggledDays = {}) => {
    const filteredData = {};

    Object.keys(data).forEach(date => {
        if (toggledDays[date]) {
            filteredData[date] = data[date];
        } else {
            filteredData[date] = data[date].filter(entry => {
                const hour = new Date(entry.dt * 1000).getHours();
                return hour === 11 || hour === 20;
            });
        }
    });

    return filteredData;
};

const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getDay()];
}

export default function WeeklyPage() {
    const [location, setLocation] = useState('');
    const [submittedLocation, setSubmittedLocation] = useState('');
    const [forecast, setForecast] = useState(null);
    const [toggledDays, setToggledDays] = useState({});
    const [error, setError] = useState('');

    const fetchForecast = useCallback(async (loc, daysToggled) => {
        if (!loc) return;
        try {
            const forecastData = await get5DayForecast(loc);
            const filteredData = filterForecastData(forecastData, daysToggled);
            setForecast(filteredData);
            setSubmittedLocation(loc);
            setError('');
        } catch (err) {
            setError('Error fetching forecast');
        }
    }, []);

    const handleGetForecast = () => {
        fetchForecast(location, toggledDays);
    };

    const handleToggleDayHourly = (date) => {
        const newToggledDays = { ...toggledDays, [date]: !toggledDays[date] };
        setToggledDays(newToggledDays);
        fetchForecast(location, newToggledDays);
    };

    return (
        <div>
            <h2>5-Day Weather Forecast {submittedLocation ? ` for ${submittedLocation}` : ''}</h2>
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button onClick={handleGetForecast}>Get Forecast</button>
            {error && <p>{error}</p>}
            {forecast && (
                <div>
                    <div className="card-container">
                        {Object.keys(forecast).map((date, index) => (
                            <div className={`card ${toggledDays[date] ? 'card-expanded' : ''}`} key={index}>
                                <h3 className="card-date">{`${getDayOfWeek(forecast[date][0].dt)} ${date}`}</h3>
                                {forecast[date].map((entry, subIndex) => (
                                    <div key={subIndex} className="weather-entry">
                                        <p>{new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>                                    
                                        <p>{entry.main.temp}°F</p>
                                        <div className="condition-icon">
                                            <p>{entry.weather[0].description}</p>
                                            <img
                                                src={getIconUrl(entry.weather[0].icon)}
                                                alt={entry.weather[0].description}
                                                className="weather-icon"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => handleToggleDayHourly(date)} className="toggle-button">
                                    {toggledDays[date] ? "Show Day/Night" : "Show Hourly"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
