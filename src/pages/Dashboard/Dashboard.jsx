import { useEffect, useState } from "react";
import * as userService from '../../utilities/users-service';


export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUser(); 
        setUser(userData);
      } catch (err) {
        setError('Error fetching user data');
      }
    };
    // Function to fetch weather data based on user's current location
    const fetchCurrentLocationWeather = async () => {
      if ("geolocation" in navigator) { // Check if geolocation is supported by the browser
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Fetch weather data using the coordinates
              const apiUrl = process.env.REACT_APP_API_URL;
              const response = await fetch(`${apiUrl}/api/weather/current?lat=${latitude}&lon=${longitude}`);
              if (!response.ok) throw new Error('Error fetching data');
              const data = await response.json();
              setWeather(data);
              setError('');
            } catch (err) {
              setError('Error fetching weather data');
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
      <h1>Welcome, {user ? user.name : 'Guest'}</h1>
      <br />
      <h2>Current Location Weather</h2>
      {loading && <p>Searching for your location...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h3>📍{weather.name}</h3>
          <p>Temperature: {weather.temperature}°F</p>
          <p>Condition: {weather.description}</p>
        </div>
      )}
    </div>
  );
}
