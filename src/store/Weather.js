// src/Weather.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setWeatherData } from "./weatherSlice";
import axios from "axios";
import Select from "react-select";
import { pakistanCities } from "./Cities";
import sun from "./assets/sun.png";
import cloud from "./assets/cloudy.png";

const Weather = () => {
  const dispatch = useDispatch();
  const weatherData = useSelector((state) => state.weather.weatherData);

  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // could be get form env as it was only one key so added here
  const API_KEY = "2429a22cb7837f718e0e4ba4d88a7308";

  const fetchWeatherData = async () => {
    if (!selectedCity) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.label}&appid=${API_KEY}`
      );
      dispatch(setWeatherData(response.data));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("City not found");
      } else {
        setError("An error occurred while fetching weather data");
      }
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = [
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    // Add more city options here
  ];

  return (
    <div className="container">
      <div className="header">
        <h1>Atmosphere360</h1>
      </div>
      <div className="select-container">
        <div className="searchbox">
          <Select
            className="select"
            options={pakistanCities}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select a city"
          />
          <button
            className="button"
            onClick={fetchWeatherData}
            disabled={!selectedCity || loading}
          >
            Get Weather
          </button>
        </div>
      </div>

      <div className="result">
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div className="weather-card">
            <img
              src={
                weatherData.weather[0].description == "few clouds" ? cloud : sun
              }
              width="100px"
            />
            <h2>Weather in {weatherData.name}</h2>
            <div className="weather-info">
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
