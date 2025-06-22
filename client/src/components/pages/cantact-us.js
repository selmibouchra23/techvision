/*import React from 'react';
import '../../App.css';

export default function AboutUs() {
  return <h1 className='about-us'>AboutUs</h1>;
}*/



import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
//import React from 'react';
import '../../App.css';
import Footer from '../Footer';
import Hero from './Hero';
import './Hero.css'
import aboutImage from "../img/5.jpg"
import Contactus from "../pages/cantact"


function CantectUs() {


  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);



  return (
    <>
      <Hero
      cName="hero"
      heroImg ={aboutImage}
      title ='Cantect us'
      />
      <Contactus/>
      <Footer/>
      
      
    </>
  );
}

export default CantectUs;
