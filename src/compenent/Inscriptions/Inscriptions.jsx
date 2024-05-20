import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import supabase from '../../supabase'; // Assurez-vous que ce chemin est correct

const InscriptionPage = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError(''); // Reset error message

    try {
      // Vérifier si l'email existe déjà dans la table Authentification
      const { data: existingUsers, error: selectError } = await supabase
        .from('Authentification')
        .select('email')
        .eq('email', registerEmail);

      if (selectError) {
        console.error('Erreur lors de la vérification des utilisateurs existants :', selectError);
        throw new Error('Erreur lors de la vérification des utilisateurs existants.');
      }

      if (existingUsers.length > 0) {
        throw new Error('Cet email est déjà enregistré.');
      }

      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerPassword, salt);

      // Insertion de l'utilisateur dans la table Authentification avec Supabase
      const { data, error } = await supabase
        .from('Authentification')
        .insert([{ email: registerEmail, password: hashedPassword }]);

      if (error) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
        throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
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
