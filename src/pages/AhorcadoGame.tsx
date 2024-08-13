import React, { useState } from 'react';

const words = ['REACT', 'JAVASCRIPT', 'HANGMAN', 'COMPONENT', 'PROGRAMMING'];

const Hangman: React.FC = () => {
  const [word] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);

  const maxMistakes = 6;

  const handleGuess = (letter: string) => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
      if (!word.includes(letter)) {
        setMistakes(mistakes + 1);
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, i) => (
      <span key={i} style={{ marginRight: '8px', fontSize: '24px' }}>
        {guesses.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderButtons = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map((letter, i) => (
      <button
        key={i}
        onClick={() => handleGuess(letter)}
        disabled={guesses.includes(letter) || mistakes >= maxMistakes}
        style={{
          margin: '4px',
          padding: '10px',
          fontSize: '16px',
          backgroundColor: '#009929',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          opacity: guesses.includes(letter) ? 0.5 : 1,
        }}
      >
        {letter}
      </button>
    ));
  };

  const renderGameStatus = () => {
    if (mistakes >= maxMistakes) {
      return <p style={{ fontSize: '24px', color: 'red' }}>You lost! The word was: {word}</p>;
    } else if (word.split('').every((letter) => guesses.includes(letter))) {
      return <p style={{ fontSize: '24px', color: 'green' }}>You won!</p>;
    } else {
      return <p style={{ fontSize: '24px' }}>Mistakes: {mistakes} / {maxMistakes}</p>;
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hangman Game</h1>
      <div style={{ margin: '20px 0' }}>{renderWord()}</div>
      <div>{renderButtons()}</div>
      <div style={{ marginTop: '20px' }}>{renderGameStatus()}</div>
    </div>
  );
};

export default Hangman;
