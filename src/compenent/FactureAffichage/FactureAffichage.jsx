import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import Menu from '../Menu/Menu'; 
import './FactureAffichage.css'; // Vérifiez et ajustez ce chemin

const FactureAffichage = () => {
  const [factures, setFactures] = useState([]);
  const [editFactureId, setEditFactureId] = useState(null);
  const [formData, setFormData] = useState({
    Client: '',
    TotalHT: '',
    TVA: '',
    TotalTTC: '',
  });

  useEffect(() => {
    fetchFactures();
  }, []);

  async function fetchFactures() {
    const { data, error } = await supabase.from('Facture').select('*');
    if (!error) {
      setFactures(data);
    } else {
      console.error('Erreur lors du chargement des factures', error.message);
    }
  }

  useEffect(() => {
    if (editFactureId) {
      const totalHT = parseFloat(formData.TotalHT) || 0;
      const tva = parseFloat(formData.TVA) / 100 || 0;
      const totalTTC = totalHT + totalHT * tva;
      setFormData((prevFormData) => ({ ...prevFormData, TotalTTC: totalTTC.toFixed(2) }));
    }
  }, [formData.TotalHT, formData.TVA, editFactureId]);

  const handleEdit = (facture) => {
    setEditFactureId(facture.id);
    setFormData({
      Client: facture.Client,
      TotalHT: facture.TotalHT.toString(),
      TVA: facture.TVA.toString(),
      TotalTTC: facture.TotalTTC.toString(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('Facture')
      .update({
        Client: formData.Client,
        TotalHT: parseFloat(formData.TotalHT),
        TVA: parseFloat(formData.TVA),
        TotalTTC: parseFloat(formData.TotalTTC),
      })
      .match({ id: editFactureId });
    if (!error) {
      fetchFactures();
      setEditFactureId(null);
    } else {
      console.error('Erreur lors de la mise à jour', error.message);
    }
  };

  const handleCancel = () => {
    setEditFactureId(null);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Facture').delete().match({ id });
    if (!error) {
      fetchFactures();
    } else {
      console.error('Erreur lors de la suppression', error.message);
    }
  };

  return (
    <div className="app">
      <Menu />
      <div className="facture-affichage-container">
        <h1>Gestion des Factures</h1>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Total HT</th>
              <th>TVA (%)</th>
              <th>Total TTC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((facture) => (
              <tr key={facture.id}>
                <td>
                  {editFactureId === facture.id ? (
                    <input
                      type="text"
                      name="Client"
                      value={formData.Client}
                      onChange={handleChange}
                    />
                  ) : (
                    facture.Client
                  )}
                </td>
                <td>
                  {editFactureId === facture.id ? (
                    <input
                      type="number"
                      name="TotalHT"
                      value={formData.TotalHT}
                      onChange={handleChange}
                    />
                  ) : (
                    facture.TotalHT
                  )}
                </td>
                <td>
                  {editFactureId === facture.id ? (
                    <input
                      type="number"
                      name="TVA"
                      value={formData.TVA}
                      onChange={handleChange}
                    />
                  ) : (
                    facture.TVA
                    )}
                  </td>
                  <td>{editFactureId === facture.id ? formData.TotalTTC : facture.TotalTTC}</td>
                  <td>
                    {editFactureId === facture.id ? (
                      <>
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(facture)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(facture.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default FactureAffichage;
  
