import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";

export default function NavBar({ user, setUser }) {
    function handleLogOut() {
        userService.logOut();
        setUser(null);
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span>Welcome, {user.name}</span>
            </div>
            <div className="navbar-center">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/weekly">Weekly</Link>
                <Link to="/locations">Locations</Link>
            </div>
            <div className="navbar-right">
                <Link to="" onClick={handleLogOut}>
                    Log Out
                </Link>
            </div>
        </nav>
    );
}
