import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

interface Prize {
  imageSrc: string;
  quantity: number;
  name: string;
}

const ScratchCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratching, setScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  const initialPrizes = JSON.parse(localStorage.getItem('prizes') || '[]');
  
  const [prizes, setPrizes] = useState<Prize[]>(initialPrizes.length > 0 ? initialPrizes : [
    { imageSrc: '../src/assets/mochila.png', quantity: 1, name: 'Premio 1' },
    { imageSrc: '../src/assets/botella-de-agua.png', quantity: 1, name: 'Premio 2' },
  ]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const logoImage = new Image();
      logoImage.src = '../src/assets/logo.png';
      
      logoImage.onload = () => {
        if (ctx) {
          ctx.fillStyle = '#CCCCCC';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(logoImage, (canvas.width - 100) / 2, (canvas.height - 100) / 2, 100, 100);
        }
      };
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = () => {
    setScratching(true);
  };

  const handleMouseUp = () => {
    setScratching(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scratching || !canvasRef.current || revealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2, false);
      ctx.fill();

      const scratchedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let scratchedPixels = 0;
      for (let i = 0; i < scratchedData.data.length; i += 4) {
        if (scratchedData.data[i + 3] === 0) {
          scratchedPixels++;
        }
      }
      const totalPixels = scratchedData.data.length / 4;
      const percentage = (scratchedPixels / totalPixels) * 100;
      setScratchPercentage(percentage);

      if (percentage > 50) {
        selectPrize();
      }
    }
  };

  const selectPrize = () => {
    const availablePrizes = prizes.filter(prize => prize.quantity > 0);

    if (availablePrizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePrizes.length);
      const selected = availablePrizes[randomIndex];
      setSelectedPrize(selected);
      setRevealed(true);
      setShowPopup(true);

      const updatedPrizes = prizes.map(prize => {
        if (prize.name === selected.name) {
          return { ...prize, quantity: prize.quantity > 0 ? prize.quantity - 1 : 0 };
        }
        return prize;
      });

      setPrizes(updatedPrizes);
      localStorage.setItem('prizes', JSON.stringify(updatedPrizes));
    } else {
      setSelectedPrize(null);
      setRevealed(true);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    const remainingPrizes = prizes.some(prize => prize.quantity > 0);
    setShowPopup(false);

    if (!remainingPrizes) {
      alert('No hay más premios disponibles');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {revealed && selectedPrize && <Confetti width={windowSize.width} height={windowSize.height} />}

      <div 
        className="scratch-card-wrapper" 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <div 
          className="scratch-card-container" 
          style={{ 
            position: 'relative', 
            width: '500px', 
            height: '300px',
          }}
        >
          {/* Mostrar la imagen del premio debajo del canvas */}
          {selectedPrize && (
            <img
              src={selectedPrize.imageSrc}
              alt={selectedPrize.name}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '500px', 
                height: '300px', 
                objectFit: 'cover', 
                zIndex: 1, 
                borderRadius: '8px' 
              }}
            />
          )}

          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="scratch-canvas"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, borderRadius: '8px' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <p className="scratch-instruction" style={{ marginTop: '20px', fontSize: '18px', color: '#555' }}>
          Raspa para revelar tu premio!
        </p>

        {showPopup && (
          <div className="popup" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            textAlign: 'center',
          }}>
            {selectedPrize ? (
              <>
                <h2>¡Felicidades!</h2>
                <p>¡Has ganado {selectedPrize.name}!</p>
                <img src={selectedPrize.imageSrc} alt="Prize" style={{ width: '150px', height: 'auto', margin: '10px 0' }} />
              </>
            ) : (
              <h2>No hay más premios disponibles</h2>
            )}
            <button onClick={handleClosePopup} style={{
              padding: '10px 20px',
              backgroundColor: '#009929',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ScratchCard;