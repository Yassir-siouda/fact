import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './compenent/Connexions/connexion';
import Inscriptions from './compenent/Inscriptions/Inscriptions';
import Menu from './compenent/Menu/Menu';
import Profile from './compenent/Profile/Profile';
import Facture from './compenent/Facture/Facture';
import FactureAffichage from './compenent/FactureAffichage/FactureAffichage';
import DevisAffichage from './compenent/DevisAffichage/DevisAffichage';
import Devis from './compenent/Devis/Devis';
import Clients from './compenent/Client/Clients';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/inscriptions" element={<Inscriptions />} />
        <Route path="/menu" element={isLoggedIn ? <Menu /> : <Navigate to="/" />} />
        <Route path="/profile/:userId" element={<Profile/>} /> 
        <Route path="/facture" element={<Facture />} />
        <Route path="/facture-affichage" element={<FactureAffichage />} />
        <Route path="/devis-affichage" element={<DevisAffichage />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/clients" element={<Clients />} />
        
      </Routes>
    </Router>
  );
}

export default App;