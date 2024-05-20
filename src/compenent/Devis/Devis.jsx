import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu'; 
import supabase from '../../supabase';
import './Devis.css';

const Devis = ({ userId }) => {
  const [formData, setFormData] = useState({
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
    user_id: userId // Utilisateur actuellement connecté
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
    const { error } = await supabase.from('Devis').insert([formData]);
    if (error) {
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } else {
      alert('Devis enregistrée avec succès!');
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
        user_id: userId // Réinitialiser l'ID de l'utilisateur
      });
    }
  };

  return (
    <div className="appdevis">
      <Menu />
      <div className="devis-content">
        <h1>Ajouter un Devis</h1>
        <form onSubmit={handleSubmit} className="devis-form">
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
          <button type="submit">Soumettre la Devis</button>
        </form>
      </div>
    </div>
  );
};

export default Devis;
