import axios from "axios";
import { useState } from "react";
import "../App.css";

function Weather() {

    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const getWeather = async () => {

        const trimmedCity = city.trim();

        if(trimmedCity === ""){
            setError("Please enter city name");
            setWeather(null);
            return;
        }

        if(!apiKey){
            setError("Weather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env file.");
            setWeather(null);
            return;
        }

        try{

            setError("");

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric`
            );

            setWeather(response.data);

        }

        catch(err){

            console.error(err);
            setWeather(null);

            if (err.response?.status === 401) {
                setError("Weather API key is invalid or unauthorized. Please update your OpenWeather API key.");
            } else if (err.response?.status === 404) {
                setError("City not found");
            } else {
                setError("Unable to fetch weather right now.");
            }

        }

    };

    return(

        <div className="container">

            <div className="weather-box">

                <h1>Weather Report</h1>

                <input
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                />

                <button onClick={getWeather}>
                    Search
                </button>

                {error && <p className="error">{error}</p>}

                {weather && (

                    <div className="result">

                        <h2>{weather.name}</h2>

                        <h3>{weather.main.temp} °C</h3>

                        <p>{weather.weather[0].main}</p>

                        <p>Humidity : {weather.main.humidity}%</p>

                        <p>Wind Speed : {weather.wind.speed} m/s</p>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Weather;