import React from 'react';
import '../App.css';
import { Button } from './Button';
import './TechVision.css';

function TechVision() {
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
        >
          Explore Our Services
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          REQUEST A SERVICES <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default TechVision; 
