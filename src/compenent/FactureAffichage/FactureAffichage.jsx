import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import Menu from '../Menu/Menu';
import './FactureAffichage.css';

const FactureAffichage = () => {
  const [factures, setFactures] = useState([]);
  const [editFactureId, setEditFactureId] = useState(null);
  const [formData, setFormData] = useState({
    Client: '',
    TotalHT: '',
    TVA: '',
    TotalTTC: '',
    Status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFactures = async () => {
    const { data, error } = await supabase.from('Facture').select('*');
    if (!error) {
      setFactures(data.map(facture => ({
        ...facture,
        created_at: formatDate(facture.created_at)
      })));
    } else {
      console.error('Erreur lors du chargement des factures', error.message);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  useEffect(() => {
    if (editFactureId) {
      const totalHT = parseFloat(formData.TotalHT) || 0;
      const tva = parseFloat(formData.TVA) / 100 || 0;
      const totalTTC = totalHT + totalHT * tva;
      setFormData((prevFormData) => ({ ...prevFormData, TotalTTC: totalTTC.toFixed(2) }));
    }
  }, [formData.TotalHT, formData.TVA, editFactureId, fetchFactures]);

  const handleEdit = (facture) => {
    setEditFactureId(facture.id);
    setFormData({
      Client: facture.Client,
      TotalHT: facture.TotalHT.toString(),
      TVA: facture.TVA.toString(),
      TotalTTC: facture.TotalTTC.toString(),
      Status: facture.Status,
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
        Status: formData.Status,
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

  const calculerTotaux = (factures) => {
    let totalHT = 0;
    let totalTTC = 0;

    factures.forEach(facture => {
      totalHT += parseFloat(facture.TotalHT);
      totalTTC += parseFloat(facture.TotalTTC);
    });

    return { totalHT, totalTTC };
  };

  const { totalHT, totalTTC } = calculerTotaux(factures);

  const filteredFactures = factures.filter(facture =>
    facture.Client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  return (
    <div className="app">
      <Menu />
      <div className="facture-affichage-container">
        <h1>Gestion des Factures</h1>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Rechercher par client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="totals-container">
          <div className="total">
            <h3>Total HT</h3>
            <p>{totalHT.toFixed(2)} €</p>
          </div>
          <div className="total">
            <h3>Total TTC</h3>
            <p>{totalTTC.toFixed(2)} €</p>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Date de Création</th>
                <th>Total HT</th>
                <th>TVA (%)</th>
                <th>Total TTC</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactures.map((facture) => (
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
                  <td>{facture.created_at}</td>
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
                  <td>
                    {editFactureId === facture.id ? formData.TotalTTC : facture.TotalTTC}
                  </td>
                  <td>
                    {editFactureId === facture.id ? (
                      <select name="Status" value={formData.Status} onChange={handleChange}>
                        <option value="Accepté">Accepté</option>
                        <option value="Refusé">Refusé</option>
                      </select>
                    ) : (
                      <span style={{ color: facture.Status === 'Accepté' ? 'green' : 'red' }}>
                        {facture.Status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editFactureId === facture.id ? (
                      <>
                        <button className="save-btn action-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn action-btn" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn action-btn" onClick={() => handleEdit(facture)}>Edit</button>
                        <button className="delete-btn action-btn" onClick={() => handleDelete(facture.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FactureAffichage;

