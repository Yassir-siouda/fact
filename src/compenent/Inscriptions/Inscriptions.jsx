import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../supabase';

const InscriptionPage = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Vérifier si l'email existe déjà
      const { data: existingUsers, error: selectError } = await supabase
        .from('Authentification')
        .select('email')
        .eq('email', registerEmail);

      if (selectError) {
        throw selectError;
      }

      if (existingUsers.length > 0) {
        throw new Error('Cet email est déjà enregistré.');
      }

      // Insertion de l'utilisateur dans la table "Connexion" avec Supabase
      const { data, error } = await supabase
        .from('Connexion')
        .insert([{ email: registerEmail, password: registerPassword }]);

      if (error) {
        throw error;
      }

      console.log('Utilisateur enregistré:', data);
      setIsRegistered(true);
    } catch (error) {
      console.error('Erreur d\'inscription :', error.message);
      setRegisterError(error.message);
    }
  };

  if (isRegistered) {
    return <Navigate to="/menu" />;
  }

  return (
    <div className="login-page">
      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">Inscription</h1>
          <form className="login-form" onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Adresse mail"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Mot de passe"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            {registerError && <div className="error-message">{registerError}</div>}
            <div className="action-group">
              <button type="submit" className="submit-btn">S'inscrire</button>
              <p className="alternative-action">Déjà un compte ? <a href="/" className="link">Se connecter</a></p>
            </div>
          </form>
        </div>
      </div>
      <div className="background-image-section"></div>
    </div>
  );
};

export default InscriptionPage;
