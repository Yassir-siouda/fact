import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import Menu from '../Menu/Menu';
import './Profiles.css'; // Assurez-vous d'avoir ce fichier CSS dans le même dossier

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userEmail = 'yassir@gmail.com';
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('Authentification')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      } else {
        setProfile(data);
      }
    };

    fetchUserData();
  }, []);

  if (!profile) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="app-container">
      <Menu />
      <div className="profile-info">
        <h1>Mon Compte</h1>
        <div className="profile-detail">
          <p><strong>Nom</strong>{profile.Nom}</p>
          <p><strong>Prénom</strong>{profile.Prénom}</p>
          <p><strong>Email</strong>{profile.email}</p>
          <p><strong>Date de Naissance</strong>{new Date(profile.DateNaissance).toLocaleDateString()}</p>
          <p><strong>Téléphone</strong>{profile.Téléphone}</p>
          <p><strong>Adresse</strong>{profile.Adresse}</p>
          {/* Ajoutez d'autres détails si nécessaire */}
        </div>
        <a href="/profile" className="nav-link"> Modifier les informations</a>
      </div>
    </div>
  );
};

export default ProfilePage;
