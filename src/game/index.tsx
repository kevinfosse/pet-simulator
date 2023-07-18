import React, { useContext, useEffect, useState, useRef } from 'react';
import { PetContext, PetContextProps } from '../App';
import { Link } from 'react-router-dom';
import './games.scss';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import {prominent} from 'color.js';

export function GamePage() {
  const { selectedAnimal, name } = useContext(PetContext) as PetContextProps;

  const [day, setDay] = useState(0);
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(0);
  const [happiness, setHappiness] = useState(100);
  const [isDead, setIsDead] = useState(false);

  const [background, setBackground] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')

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

  async function getColor(name: string) {
    const color = await prominent(`/assets/pets/${name}/${name}_happy.png`, { amount: 2 });
    return color;
  }

  function getContrastColor(hexColor:string) {
    // Convertir la couleur hexadécimale en valeurs RVB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
  
    // Calculer le contraste selon la formule WCAG 2.0
    const contrast = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Retourner une couleur de texte foncée pour les fonds clairs,
    // ou une couleur de texte claire pour les fonds foncés
    return contrast >= 128 ? '#000000' : '#ffffff';
  }

  // get color

  function rgbToHex(r: number, g: number, b: number): string {
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  }

  useEffect(() => {
    const nameLower = selectedAnimal?.nom.toLowerCase();
    if (nameLower) {
      getColor(nameLower).then((color) => {
        const primaryColor = color[1] as number[];
        console.log(primaryColor)
       // console.log(primaryColor[1]);
  
        const brightness : [number, number, number] = [
          // Add properties to the brightness object based on the retrieved color if needed
          Math.min(primaryColor[0] + 100, 255),
          Math.min(primaryColor[1] + 100, 255),
          Math.min(primaryColor[2] + 100, 255),

        ];
        
        const hexColor = rgbToHex(brightness[0], brightness[1], brightness[2]);
        setBackground(hexColor);

        const contrastColor = getContrastColor(hexColor);
        setTextColor(contrastColor);
        
      }).catch((error) => {
        console.error(error);
      });
    }
  }, []);
  
  // game logic
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
       `- Anima sélectionné : ${selectedAnimal?.nom} ${selectedAnimal?.humeurs.IconInitial}`,
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
    <div className='games' style={{backgroundColor: background, color: textColor}}>
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
            <div className="progress" style={{ width: `${health}%`, backgroundColor: background, mixBlendMode: 'difference'  }}></div>
          </div>
        </div>
        <div>
          Hunger: {(100 - hunger).toFixed(2)}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${100 - hunger}%`, backgroundColor: background, mixBlendMode: 'difference' }}></div>
          </div>
        </div>
        <div>
          Happiness: {happiness.toFixed(2)}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${happiness}%`, backgroundColor: background, mixBlendMode: 'difference'  }}></div>
          </div>
        </div>
      </div>


      <div className="buttons_container">
      <button onClick={washPet} className="pushable" style={{ backgroundColor: "rgb(129 227 237)" }}>
          <span className="front" style={{ backgroundColor: "rgb(162 245 253)" }}>
            🛁
          </span>
        </button>
    

        <button onClick={feedPet} className="pushable" style={{ backgroundColor: "rgb(241 218 128)" }}>
          <span className="front" style={{ backgroundColor: "rgb(255 230 132)" }}>
            🍕
          </span>
        </button>


        <button onClick={playWithPet} className="pushable" style={{ backgroundColor: "rgb(231 231 231)" }}>
          <span className="front" style={{ backgroundColor: "rgb(245 245 245)" }}>
            ⚽
          </span>
        </button>

      </div>

      <Footer color={textColor}/>
    </div>
  );
}
