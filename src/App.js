import './App.css';
import { Search, MapPin, Wind, Heart } from 'react-feather';
import getWeather from './api/api';
import { useState, useEffect } from 'react';
import dateFormat from 'dateformat';
import axios from 'axios';
import FavoriteCities from './FavoriteCities';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [favoriteCities, setFavoriteCities] = useState([]);

  const API_URL = "http://localhost:5000/favoriteCities"; // JSON Server URL

  useEffect(() => {
    // Fetch favorite cities when the component mounts
    axios.get(API_URL)
      .then(response => {
        setFavoriteCities(response.data);
      })
      .catch(error => console.error("There was an error fetching the favorite cities:", error));
  }, []);

  const getWeatherbyCity = async () => {
    const weatherData = await getWeather(city);
    setWeather(weatherData);
    setCity(""); 
  }

  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  }

  const addFavoriteCity = () => {
    if (weather && weather.name && !favoriteCities.includes(weather.name)) {
      const newFavoriteCity = {
        name: weather.name,
        country: weather.sys.country
      };

      axios.post(API_URL, newFavoriteCity)
        .then(response => {
          setFavoriteCities([...favoriteCities, response.data]);
        })
        .catch(error => console.error("There was an error adding the favorite city:", error));
    }
  }

  const removeFavoriteCity = (cityToRemove) => {
    const cityId = favoriteCities.find(city => city.name === cityToRemove).id;

    axios.delete(`${API_URL}/${cityId}`)
      .then(() => {
        setFavoriteCities(favoriteCities.filter(city => city.name !== cityToRemove));
      })
      .catch(error => console.error("There was an error removing the favorite city:", error));
  }

  return (
    <div className="app">
      <h1>Weather App</h1>
      <div className="input-wrapper">
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter City Name" 
        />
        <button onClick={getWeatherbyCity}>
          <Search />
        </button>
      </div>

      {weather && weather.weather && (
        <div className="content">
          <div className="location d-flex">
            <MapPin />
            <h2>{weather.name} <span>({weather.sys.country})</span></h2>
          </div>
          <p className="datetext">{renderDate()}</p>

          <div className="weatherdesc d-flex flex-c">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="" 
            />
            <h3>{weather.weather[0].description}</h3>
          </div>

          <div className="tempstats d-flex flex-c">
            <h1>{weather.main.temp} <span>&deg;C</span></h1>
            <h3>Feels Like {weather.main.feels_like} <span>&deg;C</span></h3>
          </div>

          <div className="windstats d-flex">
            <Wind />
            <h3>Wind is {weather.wind.speed} Knots in {weather.wind.deg}&deg;</h3>
          </div>

          <button className="add-to-favorites" onClick={addFavoriteCity}>
            <Heart /> Add to Favorites
          </button>
        </div>
      )}

      {!weather.weather && (
        <div className="content">
          <h4>No Data found!</h4>
        </div>
      )}

      <FavoriteCities 
        favoriteCities={favoriteCities} 
        onAddFavorite={addFavoriteCity} 
        onRemoveFavorite={removeFavoriteCity} 
      />
    </div>
  );
}

export default App;
