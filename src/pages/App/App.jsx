import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import Dashboard from "../Dashboard/Dashboard";
import LocationsPage from "../LocationsPage/LocationsPage";
import NavBar from "../../components/NavBar/NavBar";
import WeatherPage from "../WeatherPage/WeatherPage";
import WeeklyPage from "../WeeklyPage/WeeklyPage";
import "./App.css";

export default function App() {
    const [user, setUser] = useState(getUser());

    return (
        <main className="App">
            {user ? (
                <>
                    <NavBar user={user} setUser={setUser} />
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/weather" element={<WeatherPage />} />
                        <Route path="/weekly" element={<WeeklyPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route
                            path="*"
                            element={<Navigate to="/dashboard" />}
                        />
                    </Routes>
                </>
            ) : (
                <AuthPage setUser={setUser} />
            )}
        </main>
    );
}
