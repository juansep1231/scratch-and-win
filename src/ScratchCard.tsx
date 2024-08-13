import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

interface Prize {
  id: string;
  imageSrc: string;
  quantity: number;
  name: string;
}

const PrizePopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [recentPrizes, setRecentPrizes] = useState<Prize[]>([]);

  const defaultPrizes: Prize[] = [
    { id: 'T', imageSrc: '../src/assets/tango.jpg', quantity: 8, name: 'un dulce' },
    { id: 'M', imageSrc: '../src/assets/mochila.png', quantity: 4, name: 'una mochila' },
    { id: 'Te', imageSrc: '../src/assets/botella-de-agua.png', quantity: 4, name: 'un termo' },
    { id: 'A', imageSrc: '../src/assets/alfajor.png', quantity: 15, name: 'un alfajor' },
  ];

  const [prizes, setPrizes] = useState<Prize[]>(() => {
    const storedPrizes = localStorage.getItem('prizes');
    return storedPrizes ? JSON.parse(storedPrizes) : defaultPrizes;
  });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    selectPrize();
  }, []);

  const selectPrize = () => {
    let availablePrizes = prizes.filter(prize => prize.quantity > 0);

    // Ajustar las probabilidades según la cantidad restante
    let totalWeight = availablePrizes.reduce((acc, prize) => acc + prize.quantity, 0);

    // Crear una lista ponderada de premios
    let weightedPrizes: Prize[] = [];
    availablePrizes.forEach(prize => {
      for (let i = 0; i < (prize.quantity / totalWeight) * 100; i++) {
        weightedPrizes.push(prize);
      }
    });

    // Evitar premios repetidos en secuencia
    let selected: Prize | null = null;
    let attempt = 0;
    const maxAttempts = 10; // Máximo número de intentos para evitar premios repetidos

    while (!selected && attempt < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * weightedPrizes.length);
      const potentialPrize = weightedPrizes[randomIndex];

      // No permitir que 'mochila' o 'termo' se repitan seguidos
      if (recentPrizes.length > 0) {
        const lastPrize = recentPrizes[recentPrizes.length - 1];
        if ((lastPrize.name === 'una mochila' && potentialPrize.name === 'una mochila') ||
            (lastPrize.name === 'un termo' && potentialPrize.name === 'un termo')) {
          attempt++;
          continue;
        }
      }

      selected = potentialPrize;
      attempt++;
    }

    if (!selected) {
      selected = weightedPrizes[Math.floor(Math.random() * weightedPrizes.length)];
    }

    setSelectedPrize(selected);

    const updatedPrizes = prizes.map(prize => {
      if (prize.name === selected.name) {
        return { ...prize, quantity: prize.quantity > 0 ? prize.quantity - 1 : 0 };
      }
      return prize;
    });

    setPrizes(updatedPrizes);
    localStorage.setItem('prizes', JSON.stringify(updatedPrizes));

    // Actualizar el historial de premios recientes, manteniendo los últimos premios
    setRecentPrizes(prev => [...prev, selected].slice(-3));
  };

  const handleClosePopup = () => {
    const remainingPrizes = prizes.some(prize => prize.quantity > 0);
    setShowPopup(false);

    if (!remainingPrizes) {
      localStorage.removeItem('prizes');
      navigate('/');
      alert('No hay más premios disponibles');

    } else {
      navigate('/');
    }
  };

  return (
    <>
      {selectedPrize && <Confetti width={windowSize.width} height={windowSize.height} />}
      
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
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h3 style={{ color: '#EEEEEE', fontSize: '12px' }}>Premios</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {prizes.map((prize, index) => (
            <li key={index} style={{ margin: '5px 0', color: '#EEEEEE', fontSize: '10px' }}>
              {prize.id}: {prize.quantity} restantes
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PrizePopup;
