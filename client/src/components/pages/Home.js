import React , { useEffect } from 'react';
import '../../App.css';
import { useLocation } from 'react-router-dom';


import TechVision from '../TechVision';

//import Services from './Services';
import OurServices from '../pages/Our-services'
import ProjectsSection from '../projetSection/ProjectsSection';
import Footer from '../Footer';

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
        <ProjectsSection/>
      </div>
      
      
      <Footer/>
      
      
    </>
  );
}

export default Home;
