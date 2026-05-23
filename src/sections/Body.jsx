import Searchbar from '../components/Searchbar'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { cityContext } from '../context'

const themeMap = {
  thunderstorm: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-violet-600 hover:bg-violet-500 text-white',
    title: 'text-white',
    overlay: 'overlay-stormy',
    animation: 'animation-stormy',
    label: 'Stormy',
  },
  snow: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-200 via-sky-200 to-white text-slate-900',
    card: 'bg-white/80 border-slate-300 text-slate-900',
    button: 'bg-sky-500 hover:bg-sky-400 text-white',
    title: 'text-slate-900',
    overlay: 'overlay-snowy',
    animation: 'animation-snowy',
    label: 'Snowy',
  },
  rain: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-800 via-blue-700 to-cyan-700 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-blue-500 hover:bg-blue-400 text-white',
    title: 'text-white',
    overlay: 'overlay-rainy',
    animation: 'animation-rainy',
    label: 'Rainy',
  },
  drizzle: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-800 via-blue-700 to-cyan-700 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-blue-500 hover:bg-blue-400 text-white',
    title: 'text-white',
    overlay: 'overlay-rainy',
    animation: 'animation-rainy',
    label: 'Drizzle',
  },
  clouds: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-slate-400 hover:bg-slate-300 text-slate-900',
    title: 'text-white',
    overlay: 'overlay-cloudy',
    animation: 'animation-cloudy',
    label: 'Cloudy',
  },
  clear: {
    wrapper: 'min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-cyan-500 text-slate-900',
    card: 'bg-white/90 border-slate-200 text-slate-900',
    button: 'bg-amber-500 hover:bg-amber-400 text-slate-900',
    title: 'text-slate-900',
    overlay: 'overlay-sunny',
    animation: 'animation-sunny',
    label: 'Sunny',
  },
  wind: {
    wrapper: 'min-h-screen bg-gradient-to-br from-sky-500 via-cyan-400 to-slate-700 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-cyan-500 hover:bg-cyan-400 text-white',
    title: 'text-white',
    overlay: 'overlay-windy',
    animation: 'animation-windy',
    label: 'Windy',
  },
  default: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white',
    card: 'bg-white/10 border-white/20 text-white',
    button: 'bg-cyan-500 hover:bg-cyan-400 text-white',
    title: 'text-white',
    overlay: 'overlay-default',
    animation: 'animation-default',
    label: 'Calm',
  },
}

const getTheme = (weather) => {
  if (!weather) return themeMap.default
  const key = weather.main?.toLowerCase()
  return themeMap[key] || (weather.wind >= 14 ? themeMap.wind : themeMap.default)
}

const formatTime = (timestamp, timezone) => {
  // compute epoch ms representing the target local time, then format in UTC
  const ms = (timestamp + (timezone || 0)) * 1000
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(ms))
}

const formatDate = (timestamp, timezone) => {
  const ms = (timestamp + (timezone || 0)) * 1000
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(ms))
}

const Body = () => {
  const [weather, setWeather] = useState(null)
  const obj = useContext(cityContext)
  const city = obj.city
  const theme = useMemo(() => getTheme(weather), [weather])
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))

  const get = () => {
    const apiKey = 'ec579c5b287028b0d80aad62987df7c8'
    if (!city) {
      alert('Please enter a city name')
      return
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === '404') {
          alert('City data is not available')
          return
        }

        const details = {
          name: data.name,
          country: data.sys.country,
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          visibility: data.visibility,
          wind: data.wind.speed,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          dt: data.dt,
          timezone: data.timezone,
        }

        setWeather(details)
      })
      .catch(() => alert('Error while fetching data'))
  }

  // update local clock every second so displayed time is real-time for the selected city's timezone
  useEffect(() => {
    if (!weather) return
    setNow(Math.floor(Date.now() / 1000))
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(t)
  }, [weather])

  // optional: auto-refresh weather every 10 minutes while a city is selected
  useEffect(() => {
    if (!city) return
    const refreshInterval = setInterval(() => {
      // re-fetch latest weather in background
      const apiKey = 'ec579c5b287028b0d80aad62987df7c8'
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.main) {
            setWeather((prev) => ({
              ...prev,
              name: data.name,
              country: data.sys?.country,
              main: data.weather[0].main,
              description: data.weather[0].description,
              icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              temp: data.main.temp,
              feels_like: data.main.feels_like,
              humidity: data.main.humidity,
              pressure: data.main.pressure,
              visibility: data.visibility,
              wind: data.wind.speed,
              sunrise: data.sys.sunrise,
              sunset: data.sys.sunset,
              dt: data.dt,
              timezone: data.timezone,
            }))
          }
        })
        .catch(() => {})
    }, 10 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [city])

  return (
    <div className={`${theme.wrapper} relative overflow-hidden transition-all duration-700`}>
      <div className={`weather-overlay ${theme.overlay}`} />
      <div className={`weather-animation ${theme.animation}`} />
      <main className='relative z-10 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-6 lg:grid-cols-[1.55fr_0.95fr]'>
            <section className='rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl'>
              <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Live Weather Dashboard</p>
              <h2 className='mt-4 text-3xl font-semibold text-white sm:text-4xl'>Professional weather insights</h2>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-white/70'>Search any city to view the latest weather conditions, including temperature, humidity, pressure, wind speed, sunrise, and sunset.</p>
            </section>
            <section className='rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl'>
              <div className='space-y-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='min-w-0'>
                    <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Search city</p>
                    <p className='mt-2 text-lg font-medium text-white/90'>Type a city name and press the button.</p>
                  </div>
                </div>
                <Searchbar />
                <button onClick={get} className='w-full rounded-full bg-white/15 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition duration-300 hover:bg-white/25'>Search Weather</button>
              </div>
            </section>
          </div>

          {!weather ? (
            <section className='mt-6 rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
              <p className='text-base text-white/70'>Enter a city name above to load the live weather dashboard. The layout is fully responsive and will adapt to all screen sizes.</p>
            </section>
          ) : (
            <section className='mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.95fr]'>
              <div className='rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
                <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
                  <div className='min-w-0'>
                    <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Current location</p>
                    <h1 className='mt-3 text-4xl font-semibold tracking-tight text-white break-words'>{weather.name}, {weather.country}</h1>
                    <p className='mt-2 text-sm uppercase tracking-[0.35em] text-white/60'>{formatDate(now, weather.timezone)} · {formatTime(now, weather.timezone)}</p>
                  </div>
                  <div className='flex items-center gap-4 self-start xl:self-center'>
                    <img src={weather.icon} alt={weather.description} className='h-24 w-24' />
                    <div>
                      <p className='text-sm uppercase tracking-[0.35em] text-white/70'>{weather.description}</p>
                      <p className='mt-2 text-5xl font-semibold text-white'>{Math.round(weather.temp)}°C</p>
                    </div>
                  </div>
                </div>

                <div className='mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                  <div className='rounded-[1.75rem] bg-slate-950/30 p-5'>
                    <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Feels like</p>
                    <p className='mt-3 text-3xl font-semibold text-white'>{Math.round(weather.feels_like)}°C</p>
                  </div>
                  <div className='rounded-[1.75rem] bg-slate-950/30 p-5'>
                    <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Humidity</p>
                    <p className='mt-3 text-3xl font-semibold text-white'>{weather.humidity}%</p>
                  </div>
                  <div className='rounded-[1.75rem] bg-slate-950/30 p-5'>
                    <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Wind</p>
                    <p className='mt-3 text-3xl font-semibold text-white'>{weather.wind.toFixed(1)} km/h</p>
                  </div>
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl'>
                  <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Details</p>
                  <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                    <div className='rounded-[1.5rem] bg-slate-950/30 p-4'>
                      <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Pressure</p>
                      <p className='mt-3 text-2xl font-semibold text-white'>{weather.pressure} hPa</p>
                    </div>
                    <div className='rounded-[1.5rem] bg-slate-950/30 p-4'>
                      <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Visibility</p>
                      <p className='mt-3 text-2xl font-semibold text-white'>{(weather.visibility / 1000).toFixed(1)} km</p>
                    </div>
                    <div className='rounded-[1.5rem] bg-slate-950/30 p-4'>
                      <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Sunrise</p>
                      <p className='mt-3 text-2xl font-semibold text-white'>{formatTime(weather.sunrise, weather.timezone)}</p>
                    </div>
                    <div className='rounded-[1.5rem] bg-slate-950/30 p-4'>
                      <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Sunset</p>
                      <p className='mt-3 text-2xl font-semibold text-white'>{formatTime(weather.sunset, weather.timezone)}</p>
                    </div>
                  </div>
                </div>
                <div className='rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl'>
                  <p className='text-sm uppercase tracking-[0.35em] text-white/70'>Weather status</p>
                  <div className='mt-5 flex items-center justify-between gap-4'>
                    <div>
                      <p className='text-3xl font-semibold text-white'>{themeMap[weather.main?.toLowerCase()]?.label || 'Live'}</p>
                      <p className='mt-2 text-sm text-white/60'>Dynamic theme based on live API condition.</p>
                    </div>
                    <span className='inline-flex rounded-3xl bg-white/10 px-4 py-2 text-sm font-medium text-white/90 shadow-inner shadow-white/5'>{weather.main}</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default Body
