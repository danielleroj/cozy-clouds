import { useEffect, useState } from "react";
import { getSavedLocations, deleteLocation } from "../../utilities/users-service";
import sendRequest from "../../utilities/send-request";

export default function LocationsPage() {
    const [locations, setLocations] = useState([]);
    const [weatherData, setWeatherData] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSavedLocations = async () => {
            try {
                const savedLocations = await getSavedLocations();
                setLocations(savedLocations);
                fetchWeatherData(savedLocations);
                setError('');
            } catch (err) {
                setError('Error fetching saved locations');
            }
        };

        fetchSavedLocations();
    }, []);

    const fetchWeatherData = async (locations) => {
        try {
            const weatherDataResponse = await sendRequest('/api/weather/multiple', 'POST', { locations });
            const weatherDataMap = {};
            locations.forEach((location, index) => {
                weatherDataMap[location] = weatherDataResponse[index];
            });
            setWeatherData(weatherDataMap);
        } catch (err) {
            setError('Error fetching weather data');
        }
    };

    const handleDeleteLocation = async (location) => {
        try {
            await deleteLocation(location);
            setLocations(locations.filter(loc => loc !== location));
            setWeatherData(prev => {
                const updatedData = { ...prev };
                delete updatedData[location];
                return updatedData;
            });
            setError('');
        } catch (err) {
            setError('Error deleting location');
        }
    };

    return (
        <div className="cloud-div">
            <h2>Saved Locations</h2>
            <br />
            {error && <p>{error}</p>}
            {locations.length === 0 && !error ? (
                <p>There are no saved locations.</p>
            ) : (
                <ul>
                    {locations.map((location, index) => (
                        <li className="cloud" key={index}>
                            <h3 className="location-name">{location}</h3>
                            {weatherData[location] && (
                                <div>
                                    <p>Temperature: {weatherData[location].temperature}°F</p>
                                    <p>Condition: {weatherData[location].description}</p>
                                </div>
                            )}
                            <button className="cloud-btn" onClick={() => handleDeleteLocation(location)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
