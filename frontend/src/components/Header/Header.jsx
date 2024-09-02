import React, { useEffect, useState } from 'react'
import {Logo} from '../../components'

function Header() {
  const [navItems,setNavItems]=useState([]);

  useEffect(()=>{},[]);
  
  return (
    <div className='w-full flex flex-row justify-between items-center'>
      <Logo/>

    </div>
  )
}

export default Header