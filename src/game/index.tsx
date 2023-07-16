import React, { useContext, useEffect, useState, useRef } from 'react';
import { PetContext, PetContextProps } from '../App';
import { Link } from 'react-router-dom';
import './games.scss';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

export function GamePage() {
  const { selectedAnimal, name } = useContext(PetContext) as PetContextProps;

  const [day, setDay] = useState(0);
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(0);
  const [happiness, setHappiness] = useState(100);
  const [isDead, setIsDead] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const age = Math.floor(day / 5); // Age increases by 1 every 5 "days"

  const playWithPet = () => {
    const happinessDifficulty = 1 + Math.random() * 0.04;
    const addedHappiness = Math.random() * 5 * happinessDifficulty;
    setHappiness((prev) => Math.min(100, prev + addedHappiness));
  };

  const feedPet = () => {
    const hungerDifficulty = 1 + Math.random() * 0.04;
    const reducedHunger = Math.random() * 5 * hungerDifficulty;
    setHunger((prev) => Math.max(0, prev - reducedHunger));
  };

  const washPet = () => {
    const healthDifficulty = 1 + Math.random() * 0.04;
    const addedHealth = Math.random() * 5 * healthDifficulty;
    setHealth((prev) => Math.min(100, prev + addedHealth));
  };

  useEffect(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    if (!isDead) {
      intervalId.current = setInterval(() => {
        setDay((prevDay) => prevDay + 1);

        // Difficulté aléatoire pour chaque attribut
        const healthDifficulty = 1 + Math.random() * 0.04; // Aléatoire entre 1% et 5%
        const hungerDifficulty = 1 + Math.random() * 0.04; // Aléatoire entre 1% et 5%
        const happinessDifficulty = 1 + Math.random() * 0.04; // Aléatoire entre 1% et 5%

        const newHealth = Math.max(0, health - Math.random() * 5 * healthDifficulty);
        const newHunger = Math.min(100, hunger + Math.random() * 5 * hungerDifficulty);
        const newHappiness = Math.max(0, happiness - Math.random() * 5 * happinessDifficulty);

        if (newHealth === 0 || newHunger === 100 || newHappiness === 0) {
          setIsDead(true);
          if (intervalId.current) {
            clearInterval(intervalId.current);
          }
        }

        setHealth(newHealth);
        setHunger(newHunger);
        setHappiness(newHappiness);
      }, 2000);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [health, hunger, happiness, isDead]);

  if (!selectedAnimal || !name) {
    return (
      <div className='endScreen'>
        Les données sont incomplètes ou ont été perdues...
        <br />
        <br />
        <Link to="/"><button className='backhome'>Retour à l'accueil</button></Link>
      </div>
    );
  }

  if (isDead) {
    const recapitulatifText = [
       `Récapitulatif de la partie :`,
       `- Animal sélectionné : ${selectedAnimal?.nom} ${selectedAnimal?.humeurs.IconInitial}`,
       `- Nom de l'animal : ${name}`,
       `- Age de l'animal : ${age} ans`,
       `- Nombre de jours écoulés : ${day}`,
       `- État de l'animal : Mort ☠️`,
       window.location.origin,
    ].join("\n");

    const copyRecapitulatif = () => {
      navigator.clipboard.writeText(recapitulatifText);
    };

    return (
      <div className='endScreen'>
        Votre animal de compagnie est mort... 😢
        <br />
        <br />
        <div>
          <strong>Récapitulatif de la partie :</strong>
          <br />
          <p>- Animal sélectionné : {selectedAnimal?.nom}</p>
          <p>- Nom de l'animal : {name}</p>
          <p>- Age de l'animal : {age} ans</p>
          <p>- Nombre de jours écoulés : {day}</p>
          <p>- État de l'animal : Mort ☠️</p>
          <br />
          <button className="copy" onClick={copyRecapitulatif}>Copier le récapitulatif</button>
          <Link to="/"><button className='backhome'>Retour à l'accueil</button></Link>

        </div>
        <br />
      </div>
    );
  }

  let petMood = selectedAnimal.humeurs.Heureux;

  if (health < 30 && happiness < 30) {
    petMood = selectedAnimal.humeurs.Malade;
  } else if (health < 70 || hunger > 8 || happiness < 70) {
    petMood = selectedAnimal.humeurs.Triste;
  } else if (hunger > 70) {
    petMood = selectedAnimal.humeurs.Faim;
  }

  return (
    <div className='games'>
      <Header />
      <div className="pet-box">
        <div className='pet'><img src={petMood} alt="Pet Mood" /></div>
      </div>
      <div className="pet-name" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{name}</div>
      <div className="info">
        <div>Day: {day}</div>
        <div>Age: {age}</div>
      </div>
      <div className="info_bar">
        <div>
          Health: {health.toFixed(2)}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${health}%` }}></div>
          </div>
        </div>
        <div>
          Hunger: {hunger.toFixed(2)}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${100 - hunger}%` }}></div>
          </div>
        </div>
        <div>
          Happiness: {happiness.toFixed(2)}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${happiness}%` }}></div>
          </div>
        </div>
      </div>

      <div className="buttons_container">
        <button onClick={playWithPet} className="pushable" style={{ backgroundColor: "rgb(231 231 231)" }}>
          <span className="front" style={{ backgroundColor: "rgb(245 245 245)" }}>
            ⚽
          </span>
        </button>

        <button onClick={feedPet} className="pushable" style={{ backgroundColor: "rgb(241 218 128)" }}>
          <span className="front" style={{ backgroundColor: "rgb(255 230 132)" }}>
            🍕
          </span>
        </button>

        <button onClick={washPet} className="pushable" style={{ backgroundColor: "rgb(129 227 237)" }}>
          <span className="front" style={{ backgroundColor: "rgb(162 245 253)" }}>
            🛁
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
