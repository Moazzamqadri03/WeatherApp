import './App.css'
import Footer from './sections/Footer'
import { cityContext } from './context'
import { useState } from 'react'
import Body from './sections/Body'

function App() {
  const [city, setCity] = useState('')

  return (
    <cityContext.Provider value={{ city, setCity }}>
      <div className='min-h-screen bg-slate-950'>
        <Body />
        <Footer />
      </div>
    </cityContext.Provider>
  )
}

export default App
