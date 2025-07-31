import React from 'react';
import '../App.css';
import { Button } from './Button';
import './TechVision.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

function TechVision() {
   const navigate = useNavigate();

  const handleClick = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.info('🔒 Please log in to continue.', { position: 'bottom-center' });
      navigate('/log-in');
    } else {
      navigate('/services');
    }
  };
  return (
    <div className='TechVision-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />
      <h1>Turn your ideas into innovative digital solutions</h1>    {/* adventure awaits */}
      <p>What are you waiting for?</p>
      <div className='TechVision-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
           onClick={handleClick}
        >
          Explore Our Services
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
           onClick={handleClick}
        >
          REQUEST A SERVICES <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default TechVision; 
