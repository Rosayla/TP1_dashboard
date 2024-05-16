// api.js

async function fetchWeatherData(lat, lon, apiKey) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

export { fetchWeatherData };
