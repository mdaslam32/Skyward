import React, { useState } from "react";
import "./WeatherApp.css";
// Import Icons From Asset Folder
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
import default_icon from "../Assets/default.png";

const WeatherApp = () => {
  // Declaring useSate variables
  const [icon, setIcon] = useState(default_icon);
  const [temp, setTemp] = useState(0);
  const [location, setLocation] = useState();
  const [country, setCountry] = useState();
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  //Handling Input Text Variable
  const [text, setText] = useState();
  // Miscellaneous Variables
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Weather Icon Code Declarations
  const weatherIconMap = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": drizzle_icon,
    "03n": drizzle_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };
  // Handling Input Text
  const handleCity = (e) => {
    function Capital(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    let cap = e.target.value;
    setText(Capital(cap));
  };

  // API Variables
  const search = async () => {
    setLoading(true);
    let api_key = "45dd9308a3c108aa789705284ca20547";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    // Fetching API Data
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data === "404") {
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      } else {
        setTemp(Math.floor(data.main.temp));
        setLocation(`${data.name},`);
        setCountry(data.sys.country);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || default_icon);
        setCityNotFound(false);
        setText("");
      }
    } catch (error) {
      console.error("An error Occurred: ", error.message);
      setError("An error occured while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  // Hangling Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
      setError(false);
    }
  };

  return (
    // Displaying Content
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Search"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon">
          <img
            src={search_icon}
            alt="Search Icon"
            onClick={() => {
              search();
            }}
          />
        </div>
      </div>
      <div className="weather-image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="weather-temp"> {temp}°</div>
      <div className="weather-location">
        {location} <span className="weather-country">{country}</span>
      </div>{" "}
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="Humidity Icon" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={wind_icon} alt="Wind Icon" className="icon" />
          <div className="data">
            <div className="wind-rate">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found!</div>}
    </div>
  );
};

export default WeatherApp;
