import { useState, useCallback } from "react";
import { get5DayForecast } from "../../utilities/weather-api";

const getIconUrl = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}.png`;

export default function WeeklyPage() {
    const [location, setlocation] = useState('');
    const [submittedLocation, setSubmittedLocation] = useState('');
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const fetchForecast = useCallback(async () => {
        try {
            const forecastData = await get5DayForecast(location);
            setForecast(forecastData);
            setSubmittedLocation(location);
            setError('');
        } catch (err) {
            setError('Error fetching forecast');
        }
    }, [location]);

    return (
        <div>
            <h2>5-Day Weather Forecast {submittedLocation ? ` for ${submittedLocation}` : ''}</h2>
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setlocation(e.target.value)}
            />
            <button onClick={fetchForecast}>Get Forecast</button>
            {error && <p>{error}</p>}
            {forecast && (
                <div>
                <div className="card-container">
                    {Object.keys(forecast).map((date, index) => (
                        <div className="card" key={index}>
                            <h4 className="card-date">{date}</h4>
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
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}