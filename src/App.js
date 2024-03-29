import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importer Navigate
import LoginPage from './compenent/Connexions/connexion';
import Inscriptions from './compenent/Inscriptions/Inscriptions';
import Menu from './compenent/Menu/Menu';
import Profile from './compenent/Profile/Profile';
import Profiles from './compenent/Profiles_user/Profiles';
import Facture from './compenent/Facture/Facture';
import FactureAffichage from './compenent/FactureAffichage/FactureAffichage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/inscriptions" element={<Inscriptions />} />
        <Route path="/menu" element={isLoggedIn ? <Menu /> : <Navigate to="/" />} />
      
        <Route path="/profile" element={<Profile />} />
           <Route path="/profile" element={<Profile />} />
        <Route path="/facture" element={<Facture />} />
        <Route path="/facture-affichage" element={<FactureAffichage />} />
      </Routes>
    </Router>
  );
}

export default App;
