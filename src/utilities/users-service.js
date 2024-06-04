import * as usersAPI from "./users-api";
import sendRequest from "./send-request";

const BASE_URL = "/api/users";

export async function signUp(userData) {
    const { token } = await usersAPI.signUp(userData);
    localStorage.setItem("token", token);
    return getUser();
}

export async function login(credentials) {
    const { token } = await usersAPI.login(credentials);
    localStorage.setItem("token", token);
    return getUser();
}

export function logOut() {
    localStorage.removeItem("token");
}

export function getToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
    }
    return token;
}

export function getUser() {
    const token = getToken();
    return token ? JSON.parse(atob(token.split(".")[1])).user : null;
}

export function saveLocation(location) {
    return sendRequest(`${BASE_URL}/save-location`, "POST", { location });
}

export function deleteLocation(location) {
    return sendRequest(`${BASE_URL}/delete-location/${location}`, "DELETE");
}

export function getSavedLocations() {
    return sendRequest(`${BASE_URL}/saved-locations`);
}
