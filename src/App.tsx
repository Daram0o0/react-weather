import React, { useEffect, useState } from 'react';

const api = {
  key: "6532b4792b61f46e3d8d3d9b274da010",
  base: "https://api.openweathermap.org/data/2.5/"
}

interface WeatherData {
  weather?: any;
  main?: {
    temp: number;
  };
  name?: string;
  sys?: {
    country: string;
  }
}


function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocationWeather();
  }, []);

  const search = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      fetchWeatherData(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
    }
  }

  const getCurrentWeatherByCoordinates = (lat: number, long: number) => {
    fetchWeatherData(`${api.base}weather?lat=${lat}&lon=${long}&units=metric&APPID=${api.key}`);
  };

  const fetchWeatherData = (url: string) => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setLoading(false);
        setQuery('');
        console.log(result);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      });
  };

  const dateBuilder = (d: Date) => {
    let months = ["January", "February", "March", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('Current Location:', { latitude, longitude });
          getCurrentWeatherByCoordinates(latitude, longitude);
        },
        error => {
          console.error('Error getting current location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };


  return (
    <div className={
      (typeof weather.main != "undefined")
        ? ((weather.main.temp > 16)
          ? 'app warm'
          : 'app')
        : 'app'}>
      <main>
        <div className="search-box">
          <input type='text'
            className='search-bar'
            placeholder='Enter city or country in English, please.'
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />

        </div>
        {loading ? (
          <span className="loader"></span>
        ) : (
          weather.main && weather.sys ? (
            <div>
              <div className='location-box'>
                <div className='location'>{weather.name}, {weather.sys.country}</div>
                <div className='date'>{dateBuilder(new Date())}</div>
              </div>
              <div className='weather-box'>
                <div className='temp'>
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className='icon'>
                  {weather.weather && weather.weather[0] && (
                    <img
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                      alt='weather icon'
                    />
                  )}
                </div>
                <div className='weather'>{weather.weather[0].main}</div>
              </div>
            </div>
          ) : ('')
        )}

        <button className='btn' onClick={getLocationWeather}>loc</button>
      </main>
    </div>
  );
}

export default App;
