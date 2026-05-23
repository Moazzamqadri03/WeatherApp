import Cards from '../components/Cards'
import Searchbar from '../components/Searchbar'
import { useContext } from 'react'
import { cityContext } from '../context'
import { useState } from 'react'





const Body = () => {
  const [weather, setWeather] = useState();
  const obj = useContext(cityContext);
  const city = obj.city;
  function get() {
    const apiKey = "ec579c5b287028b0d80aad62987df7c8";
    if (city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      fetch(url).then(response => response.json()).then(data => {
        if (data.cod === "404") {
          alert("City data is not available");
        } else {
          const details = { name: data.name, temp: data.main.temp, dis: data.weather[0].description, icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`, Q: "NA" };
          setWeather(details); // ✅ Store in state
        }
      }).catch(err => alert("error while data fetching"));
    }
  }

  return (
    <div className='bg-[url(https://png.pngtree.com/thumb_back/fh260/background/20240522/pngtree-a-tree-on-a-meadow-during-rainy-weather-image_15679740.jpg)]'>
      <Searchbar />
      <button className='border-3 border-blue-900 rounded-2xl bg-blue-950 text-white p-2 mx-76 mb-4 hover:border-blue-950 hover:bg-blue-800 w-30' onClick={get}>Enter</button>

      {weather && (
        <div className='text-white'>
          <span className='text-black bg-blue-200'>{weather.name}</span><br />
          <span className=' bg-black'>Date: {new Date().toLocaleDateString()}</span><br />
          <span className=' bg-black'>Time: {new Date().toLocaleTimeString()}</span><br />
          <img src={weather.icon} alt="weather icon" />
          <span className='text-2xl border-3'>{weather.temp} °C</span><br />
          <p className='border-2 rounded '>Description: {weather.dis}</p>
        </div>
      )}
      <Cards />
    </div>
  )
}

export default Body
