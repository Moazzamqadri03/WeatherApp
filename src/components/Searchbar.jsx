import React from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { cityContext } from '../context';




const Searchbar = () => {
    const obj = useContext(cityContext);
    const city = obj.city;

    const result = (e)=>{
        const value = e.target.value;
        obj.setCity(value);

    }
    
  return (
    <div className='flex justify-center'>
      <input className='text-white my-6  p-8 border-2 border-blue-900/60 rounded-full hover:border-blue-950' type="text" placeholder='Enter City'   onChange={result} />
        
    </div>
  )
}

export default Searchbar
