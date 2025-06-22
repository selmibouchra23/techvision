import React , { useEffect } from 'react';
import '../../App.css';
import { useLocation } from 'react-router-dom';


import TechVision from '../TechVision';
import Footer from '../Footer';
//import Services from './Services';
import OurServices from '../pages/Our-services'


function Home() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <TechVision />
      <div className='Features-container'>
        <OurServices/>
      </div>
      
      
      <Footer/>
      
      
    </>
  );
}

export default Home;
