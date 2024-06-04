import { useState } from 'react';
import { saveLocation } from '../../utilities/users-service'

const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}.png`;

export default function WeatherPage() {
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchWeather = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/weather/location/${location}`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setWeather(data);
            setError('');
            setMessage('');
        } catch (err) {
            setError('Error fetching data');
        }
    };

    const handleSaveLocation = async () => {
        try {
            await saveLocation(location);
            setMessage('Location saved successfully!');
            setError('');
        } catch (err) {
            setError('Error saving location');
            setMessage('');
        }
    }

    return (
        <div>
            <h2>Search Weather by Location</h2>
            <input 
                type="text"
                placeholder='Enter location'
                value={location}
                onChange={(e) => setLocation(e.target.value)} 
            />
            <button onClick={fetchWeather}>Get Weather</button>
            {error && <p>{error}</p>}
            {weather && (
                <div className='weather-page-content'>
                    <h3>Weather in {weather.name}</h3>
                    <p>Temperature: {weather.temperature}°F</p>
                    <div className="daily-condition-icon">
                        <p>Condition: {weather.description}
                            <img
                                src={getIconUrl(weather.icon)}
                                alt={weather.description}
                                className="daily-weather-icon"
                                />
                        </p>
                    </div>
                    <button onClick={handleSaveLocation}>Save Location</button>
                </div>
            )}
            {message && <p className='message'>{message}</p>}
        </div>
    );
}