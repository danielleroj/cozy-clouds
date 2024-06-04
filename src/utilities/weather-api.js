import sendRequest from "./send-request";
const BASE_URL = "/api/weather";

export function get5DayForecast(location) {
    return sendRequest(`${BASE_URL}/5-day-forecast/${location}`);
}
