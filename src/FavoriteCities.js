import React from 'react';

function FavoriteCities({ favoriteCities, onRemoveFavorite }) {
  return (
    <div className="favorite-cities">
      <h3>Favorite Cities</h3>
      <ul>
        {favoriteCities.length > 0 ? (
          favoriteCities.map((city) => (
            <li key={city.id} className="favorite-city-item">
              <span>{city.name}, {city.country}</span>
              <button onClick={() => onRemoveFavorite(city.name)}>Remove</button>
            </li>
          ))
        ) : (
          <li>No favorite cities yet.</li>
        )}
      </ul>
    </div>
  );
}

export default FavoriteCities;
