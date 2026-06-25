import { useState, useEffect } from 'react';

const MAPA_CLIMA = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️',
  95: '🌩️', 96: '🌩️', 99: '🌩️'
};

export function useClima(destino, ativo) {
  const [clima, setClima] = useState({});

  useEffect(() => {
    if (ativo && destino) {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destino)}&count=1`)
        .then(res => res.json())
        .then(geoData => {
          if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0];
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
          }
        })
        .then(res => res?.json())
        .then(weatherData => {
          if (weatherData && weatherData.daily) {
            const novoClima = {};
            weatherData.daily.time.forEach((dia, index) => {
              novoClima[dia] = {
                max: weatherData.daily.temperature_2m_max[index],
                min: weatherData.daily.temperature_2m_min[index],
                icone: MAPA_CLIMA[weatherData.daily.weathercode[index]] || '❓'
              };
            });
            setClima(novoClima);
          }
        })
        .catch(() => {});
    }
  }, [destino, ativo]);

  return { clima };
}