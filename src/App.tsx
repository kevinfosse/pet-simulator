import React, { createContext, useContext, useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.scss';
import Footer from './components/Footer';
import { listeAnimaux } from './animals';
import { GamePage } from './game'; 
import { Header } from './components/Header';
import { Analytics } from '@vercel/analytics/react';
import { prominent } from 'color.js';


// Création du contexte
export interface PetContextProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  selectedAnimal: Animal | null;
  setSelectedAnimal: React.Dispatch<React.SetStateAction<Animal | null>>;
}

export const PetContext = createContext<PetContextProps | null>(null);


function SelectPet() {

 

  const { name, setName, selectedAnimal, setSelectedAnimal } = useContext(PetContext) as PetContextProps;

  return (
    <div className="App">
      <Header/>
      <div className="interface">
        <p>Select a name for your pet</p>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <div className="selectAnimal">
          <div>
            {listeAnimaux.map((animal, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedAnimal(animal)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  backgroundColor: selectedAnimal === animal ? "rgb(255, 214, 165)" : "transparent",
                  border: selectedAnimal === animal ? "1px solid rgb(255 155 155)" : "none",
                  boxSizing: "border-box",
                  transition: "background-color 0.5s ease, border 0.5s ease"
                }}
              >
                {animal.humeurs.IconInitial}
              </div>
            ))}
          </div>
        </div>
        <Link to={selectedAnimal ? "/game" : "/"}> 
          <button className='play' disabled={!selectedAnimal || !name}>Start</button>
        </Link>
      </div>
      <Footer/>

    </div>
  );
}

function PetProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  return (
    <PetContext.Provider value={{ name, setName, selectedAnimal, setSelectedAnimal }}>
      {children}
    </PetContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <PetProvider>
        <Routes>
          <Route path="/" element={<SelectPet />} />
          <Route path="/game" element={<GamePage  />} />  
        </Routes>
      </PetProvider>
      
    </Router>
  );
}

export default App;
