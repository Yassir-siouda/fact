import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu'; // Vérifiez et ajustez le chemin selon votre structure de projet
import supabase from '../../supabase';
import './Facture.css'; // Assurez-vous que le chemin vers votre fichier CSS est correct

const Facture = () => {
  const [formData, setFormData] = useState({
    Client: '',
    Adresse: '',
    CodePostal: '',
    Ville: '',
    ComplementAdresse: '',
    Pays: '',
    Commentaire: '',
    TotalHT: '',
    TVA: '20', // TVA prédéfinie à 20%
    TotalTTC: '',
  });

  useEffect(() => {
    if (formData.TotalHT && formData.TVA) {
      const totalHT = parseFloat(formData.TotalHT);
      const tva = parseFloat(formData.TVA) / 100;
      const totalTTC = totalHT + totalHT * tva;
      setFormData(formData => ({ ...formData, TotalTTC: totalTTC.toString() }));
    }
  }, [formData.TotalHT, formData.TVA]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('Facture').insert([formData]);
    if (error) {
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } else {
      alert('Facture enregistrée avec succès!');
      // Optionnel: réinitialiser le formulaire après l'insertion réussie
      setFormData({
        Client: '',
  
        Adresse: '',
        CodePostal: '',
        Ville: '',
        ComplementAdresse: '',
        Pays: '',
        Commentaire: '',
        TotalHT: '',
        TVA: '20',
        TotalTTC: '',
      });
    }
  };

  return (
    <div className="app">
      <Menu />
      <div className="facture-content">
        <h1>Ajouter une facture</h1>
        <form onSubmit={handleSubmit} className="facture-form">
          <div className="row">
            <div className="column">
              <label>Client</label>
              <input type="text" name="Client" value={formData.Client} onChange={handleChange} placeholder="Nom du client" required />
            </div>
            <div className="column">
              <label>Adresse</label>
              <input type="text" name="Adresse" value={formData.Adresse} onChange={handleChange} placeholder="Adresse" required />
            </div>
          </div>
          
          <div className="row">
            <div className="column">
              <label>Code postal</label>
              <input type="text" name="CodePostal" value={formData.CodePostal} onChange={handleChange} placeholder="Code postal" required />
            </div>
            <div className="column">
              <label>Ville</label>
              <input type="text" name="Ville" value={formData.Ville} onChange={handleChange} placeholder="Ville" required />
            </div>
            <div className="column">
              <label>Complément d'adresse</label>
              <input type="text" name="ComplementAdresse" value={formData.ComplementAdresse} onChange={handleChange} placeholder="Complément d'adresse" />
            </div>
          </div>
          {/* ... Répétez la structure pour les autres champs nécessaires */}
          <div className="row">
            <div className="column">
              <label>Commentaire</label>
              <textarea name="Commentaire" value={formData.Commentaire} onChange={handleChange} placeholder="Commentaire"></textarea>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <label>Total HT</label>
              <input type="number" name="TotalHT" value={formData.TotalHT} onChange={handleChange} placeholder="Total HT" required />
            </div>
            <div className="column">
              <label>TVA</label>
              <input type="text" name="TVA" value={formData.TVA} onChange={handleChange} placeholder="TVA" readOnly />
            </div>
            <div className="column">
              <label>Total TTC</label>
              <input type="text" name="TotalTTC" value={formData.TotalTTC} placeholder="Total TTC" readOnly />
            </div>
          </div>
          <button type="submit">Soumettre la facture</button>
        </form>
      </div>
    </div>
  );
};

export default Facture;