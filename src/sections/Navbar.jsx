import React from 'react'
import logo from '../assets/logo.jpg'

const Navbar = () => {
  return (
    <>
    <div className='flex bg-blue-700'>
        <img width={100} src={logo} alt="" />
        <p className='text-7xl text-white mx-10 '>Weather App</p>
    </div>
    </>
  )
}

export default Navbar
