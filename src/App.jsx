
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LoaderCircle,
  CalendarDays,
  Thermometer,
  RefreshCw
} from "lucide-react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function getWeatherIcon(code, isDay = 1) {
  if (code === 1000) return isDay ? Sun : Cloud;
  if ([1003].includes(code)) return CloudSun;

  if ([1006, 1009, 1030, 1135, 1147].includes(code))
    return Cloud;

  if (
    [
      1063, 1150, 1153, 1168, 1171,
      1180, 1183, 1186, 1189, 1192,
      1195, 1198, 1201, 1240, 1243, 1246
    ].includes(code)
  ) return CloudRain;

  if (
    [
      1066, 1069, 1072, 1114, 1117,
      1210, 1213, 1216, 1219, 1222,
      1225, 1255, 1258
    ].includes(code)
  ) return CloudSnow;

  if ([1087, 1273, 1276, 1279, 1282].includes(code))
    return CloudLightning;

  return CloudSun;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date.replace(" ", "T")));
}

function App() {
  const [query, setQuery] = useState("Jakarta");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  const fetchWeather = async (city) => {
    if (!API_KEY) {
      setError("API Key belum dimasukkan ke file .env");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Kota tidak ditemukan."
        );
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Jakarta");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim()) {
      fetchWeather(query.trim());
    }
  };

  const temperature = (c, f) =>
    unit === "C"
      ? `${Math.round(c)}°`
      : `${Math.round(f)}°`;

  if (loading && !weather) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" size={40} />
        <p>Loading weather...</p>
      </div>
    );
  }

  const current = weather?.current;
  const location = weather?.location;
  const today = weather?.forecast?.forecastday?.[0];
  const forecast = weather?.forecast?.forecastday || [];

  const WeatherIcon = current
    ? getWeatherIcon(current.condition.code, current.is_day)
    : CloudSun;

  return (
    <main className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <CloudSun size={24} />
          </div>
          <span>Weather<span className="logo-highlight">Search</span></span>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          LIVE WEATHER
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">
          <span></span>
          YOUR WORLD, AT A GLANCE
        </p>

        <h1>
          Weather <span>Search.</span>
        </h1>

        <p className="hero-subtitle">
          Find the forecast. Feel the moment.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Search city or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="spin" size={19} />
            ) : (
              "Search"
            )}
          </button>
        </form>
      </section>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {weather && current && location && (
        <>
          <section className="weather-card">
            <div className="card-glow"></div>

            <div className="weather-top">
              <div className="location">
                <MapPin size={18} />
                <span>
                  {location.name}, {location.country}
                </span>
              </div>

              <div className="unit-switch">
                <button
                  className={unit === "C" ? "active" : ""}
                  onClick={() => setUnit("C")}
                  type="button"
                >
                  °C
                </button>

                <button
                  className={unit === "F" ? "active" : ""}
                  onClick={() => setUnit("F")}
                  type="button"
                >
                  °F
                </button>
              </div>
            </div>

            <div className="main-weather">
              <div className="temperature-content">
                <p className="date">
                  <CalendarDays size={16} />
                  {formatDate(location.localtime)}
                </p>

                <h2 className="temperature">
                  {temperature(current.temp_c, current.temp_f)}
                </h2>

                <h3 className="condition">
                  {current.condition.text}
                </h3>

                <p className="feels-like">
                  Feels like{" "}
                  {temperature(
                    current.feelslike_c,
                    current.feelslike_f
                  )}
                </p>
              </div>

              <div className="weather-illustration">
                <div className="sun-glow"></div>
                <WeatherIcon className="hero-icon" />
                <span className="spark spark-one">✦</span>
                <span className="spark spark-two">✧</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="weather-stats">
              <div className="stat">
                <div className="stat-icon">
                  <Wind />
                </div>
                <div>
                  <small>WIND</small>
                  <strong>{current.wind_kph} <i>km/h</i></strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon">
                  <Droplets />
                </div>
                <div>
                  <small>HUMIDITY</small>
                  <strong>{current.humidity}<i>%</i></strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon">
                  <Eye />
                </div>
                <div>
                  <small>VISIBILITY</small>
                  <strong>{current.vis_km}<i>km</i></strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon">
                  <Gauge />
                </div>
                <div>
                  <small>PRESSURE</small>
                  <strong>{current.pressure_mb}<i>mb</i></strong>
                </div>
              </div>
            </div>
          </section>

          <section className="information-grid">
            <div className="info-card">
              <div className="section-heading">
                <div>
                  <small>TODAY'S RANGE</small>
                  <h3>Temperature</h3>
                </div>
                <Thermometer />
              </div>

              <div className="temperature-range">
                <div>
                  <span className="range-arrow high">↑</span>
                  <small>MAX TEMP</small>
                  <strong>
                    {temperature(
                      today.day.maxtemp_c,
                      today.day.maxtemp_f
                    )}
                  </strong>
                </div>

                <div>
                  <span className="range-arrow low">↓</span>
                  <small>MIN TEMP</small>
                  <strong>
                    {temperature(
                      today.day.mintemp_c,
                      today.day.mintemp_f
                    )}
                  </strong>
                </div>
              </div>

              <div className="range-track">
                <span></span>
              </div>
            </div>

            <div className="info-card">
              <div className="section-heading">
                <div>
                  <small>DAYLIGHT</small>
                  <h3>Sun Times</h3>
                </div>
                <Sunrise />
              </div>

              <div className="sun-times">
                <div>
                  <Sunrise />
                  <small>SUNRISE</small>
                  <strong>{today.astro.sunrise}</strong>
                </div>

                <div>
                  <Sunset />
                  <small>SUNSET</small>
                  <strong>{today.astro.sunset}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="forecast-section">
            <div className="forecast-heading">
              <div>
                <small>PLAN AHEAD</small>
                <h2>3-Day Forecast</h2>
              </div>

              <button
                className="refresh-button"
                onClick={() => fetchWeather(location.name)}
                title="Refresh weather"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>

            <div className="forecast-grid">
              {forecast.map((day, index) => {
                const DayIcon = getWeatherIcon(
                  day.day.condition.code
                );

                const dayName =
                  index === 0
                    ? "Today"
                    : new Intl.DateTimeFormat("en-US", {
                        weekday: "long"
                      }).format(new Date(day.date + "T12:00:00"));

                return (
                  <div className="forecast-card" key={day.date}>
                    <h3>{dayName}</h3>

                    <DayIcon className="forecast-icon" />

                    <p>{day.day.condition.text}</p>

                    <div className="forecast-temperature">
                      <strong>
                        {temperature(
                          day.day.maxtemp_c,
                          day.day.maxtemp_f
                        )}
                      </strong>
                      <span>
                        {temperature(
                          day.day.mintemp_c,
                          day.day.mintemp_f
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <span>WEATHER SEARCH © 2026</span>
        <span>
          Powered by{" "}
          <a
            href="https://www.weatherapi.com/"
            target="_blank"
            rel="noreferrer"
          >
            WeatherAPI.com
          </a>
        </span>
      </footer>
    </main>
  );
}

export default App;
