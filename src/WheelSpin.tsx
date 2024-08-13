import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useNavigate } from 'react-router-dom';

const data = [
  { option: '0', style: { backgroundColor: '#5ccb5f', textColor: 'white' }, image: { uri: '../src/assets/logo.png'} },
  { option: '1', style: { backgroundColor: '#ff6961' }, image: { uri: '../src/assets/entradas.png', sizeMultiplier: 0.5} },
  { option: '2', style: { backgroundColor: '#fdfd96', textColor: 'white' }, image: { uri: '../src/assets/regalo.png', sizeMultiplier: 0.5 } },
  { option: '3', style: { backgroundColor: '#5ccb5f', textColor: 'white' }, image: { uri: '../src/assets/logo.png'} },
  { option: '4', style: { backgroundColor: '#ff6961' }, image: { uri: '../src/assets/entradas.png', sizeMultiplier: 0.5} },
  { option: '5', style: { backgroundColor: '#fdfd96', textColor: 'white' }, image: { uri: '../src/assets/regalo.png', sizeMultiplier: 0.5 } },
  { option: '6', style: { backgroundColor: '#5ccb5f', textColor: 'white' }, image: { uri: '../src/assets/logo.png'} },
  { option: '7', style: { backgroundColor: '#ff6961' }, image: { uri: '../src/assets/entradas.png', sizeMultiplier: 0.5} },
  { option: '8', style: { backgroundColor: '#fdfd96', textColor: 'white' }, image: { uri: '../src/assets/regalo.png', sizeMultiplier: 0.5 } },
];

const SpinningWheel: React.FC = () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const navigate = useNavigate();
    const handleSpinClick = () => {
      if (!mustSpin) {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        console.log(newPrizeNumber);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
      }
    }
  
    const handleSpinResult = () => {
      navigate('/scratch');
  }
    return (
      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          innerBorderColor='white'
          outerBorderColor='white'
          radiusLineColor='white'
          innerBorderWidth={20}
          onStopSpinning={() => {
            setMustSpin(false);
            handleSpinResult();
            
          }}
        />
        <button className="spin-button" onClick={handleSpinClick}>GIRAR</button>
      </div>
    );
}

export default SpinningWheel;
