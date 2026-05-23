import React from 'react'
import { useContext } from 'react'
import { cityContext } from '../context'

const Searchbar = () => {
  const obj = useContext(cityContext)

  const result = (e) => {
    obj.setCity(e.target.value)
  }

  return (
    <div className='flex justify-center'>
      <input
        className='w-full max-w-xl rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/60 outline-none transition duration-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30'
        type='text'
        placeholder='Search city — Moazzam qadri'
        onChange={result}
      />
    </div>
  )
}

export default Searchbar
