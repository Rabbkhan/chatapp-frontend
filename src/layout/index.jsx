import React from 'react'
import Logo from '../assets/logo.png'
const AuthLayouts = ({children}) => {
  return (
    <>
    
    <header className='bg-white shadow-md flex justify-center items-center py-3 h-20'>
    <img src={Logo} alt='logo' className=' md:h-56  h-36 mt-4' />
    </header>

    {children }
    </>
  )
}

export default AuthLayouts