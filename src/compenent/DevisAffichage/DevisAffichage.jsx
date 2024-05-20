import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import Menu from '../Menu/Menu';
import Modal from 'react-modal';
import './DevisAffichage.css';

Modal.setAppElement('#root');

const DevisAffichage = () => {
  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [formData, setFormData] = useState({
    Client: '',
    TotalHT: '',
    TVA: '',
    TotalTTC: '',
    Status: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Tous'); // Nouveau state pour le filtre

  useEffect(() => {
    fetchDevis();
  }, []);

  async function fetchDevis() {
    const { data, error } = await supabase.from('Devis').select('*');
    if (!error) {
      setDevis(data);
      setFilteredDevis(data);
    } else {
      console.error('Erreur lors du chargement des devis', error.message);
    }
  }

  const handleEdit = (devis) => {
    setEditId(devis.id);
    setFormData({
      Client: devis.Client,
      TotalHT: devis.TotalHT.toString(),
      TVA: devis.TVA.toString(),
      TotalTTC: devis.TotalTTC.toString(),
      Status: devis.Status,
    });
    setShowModal(true);
  };

  const handleShow = (devis) => {
    setFormData({
      Client: devis.Client,
      TotalHT: devis.TotalHT.toString(),
      TVA: devis.TVA.toString(),
      TotalTTC: devis.TotalTTC.toString(),
      Status: devis.Status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditId(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('Devis')
      .update({
        Client: formData.Client,
        TotalHT: parseFloat(formData.TotalHT),
        TVA: parseFloat(formData.TVA),
        TotalTTC: parseFloat(formData.TotalTTC),
        Status: formData.Status,
      })
      .match({ id: editId });
    if (!error) {
      fetchDevis();
      handleCloseModal();
    } else {
      console.error('Erreur lors de la mise à jour', error.message);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Devis').delete().match({ id });
    if (!error) {
      setDevis(devis.filter(devis => devis.id !== id));
      setFilteredDevis(filteredDevis.filter(devis => devis.id !== id));
    } else {
      console.error('Erreur lors de la suppression', error.message);
    }
  };

  const handleConvertToFacture = async (id) => {
    const { data: devis, error } = await supabase.from('Devis').select('*').eq('id', id).single();
    if (error) {
      alert(`Erreur lors de la récupération du devis: ${error.message}`);
    } else {
      const { error: insertError } = await supabase.from('Facture').insert([devis]);
      if (insertError) {
        alert(`Erreur lors de la conversion en facture: ${insertError.message}`);
      } else {
        alert('Devis converti en facture avec succès!');
        fetchDevis(); // Recharger les devis après conversion
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = devis.map((row) => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devis.csv';
    link.click();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedData = event.target.result;
      const rows = importedData.split('\n');
      const importedDevis = rows.map((row) => {
        const values = row.split(',');
        return {
          Client: values[0],
          TotalHT: values[1],
          TVA: values[2],
          TotalTTC: values[3],
          Status: values[4],
        };
      });
      setDevis(importedDevis);
      setFilteredDevis(importedDevis);
    };
    reader.readAsText(file);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = devis.filter((devis) =>
      devis.Client.toLowerCase().includes(searchTerm)
    );
    setFilteredDevis(filtered);
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status === 'Tous') {
      setFilteredDevis(devis);
    } else {
      setFilteredDevis(devis.filter(d => d.Status === status));
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Accepté') return 'status-accepted';
    if (status === 'Refusé') return 'status-refused';
    return '';
  };

  return (
    <div className="app">
      <Menu />
      <div className="devis-affichage-container">
        <h1>Gestion des Devis</h1>
        <div className="buttons-container">
          <button className="export-btn" onClick={handleExportCSV}>Exporter CSV</button>
          <input type="file" onChange={handleImportCSV} accept=".csv" />
        </div>
        <input
          type="text"
          placeholder="Rechercher par client..."
          onChange={handleSearch}
        />
        <select value={filterStatus} onChange={handleFilterChange}>
          <option value="Tous">Tous</option>
          <option value="Accepté">Accepté</option>
          <option value="Refusé">Refusé</option>
          <option value="En attente">En attente</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Total HT</th>
              <th>TVA (%)</th>
              <th>Total TTC</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.map((devis) => (
              <tr key={devis.id}>
                <td>{devis.Client}</td>
                <td>{devis.TotalHT}</td>
                <td>{devis.TVA}</td>
                <td>{devis.TotalTTC}</td>
                <td className={getStatusClass(devis.Status)}>{devis.Status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(devis)}>Edit</button>
                  <button className="view-btn" onClick={() => handleShow(devis)}>Voir</button>
                  <button className="delete-btn" onClick={() => handleDelete(devis.id)}>Supprimer</button>
                  <button class                  className="convert-btn" onClick={() => handleConvertToFacture(devis.id)}>Convertir en Facture</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Détails du Devis"
        className="modal"
      >
        <div>
          <h2>Détails du Devis</h2>
          <p>Client: <input type="text" value={formData.Client} onChange={(e) => setFormData({ ...formData, Client: e.target.value })} /></p>
          <p>Total HT: <input type="text" value={formData.TotalHT} onChange={(e) => setFormData({ ...formData, TotalHT: e.target.value })} /></p>
          <p>TVA: <input type="text" value={formData.TVA} onChange={(e) => setFormData({ ...formData, TVA: e.target.value })} /></p>
          <p>Total TTC: <input type="text" value={formData.TotalTTC} onChange={(e) => setFormData({ ...formData, TotalTTC: e.target.value })} /></p>
          <p>Status: 
            <select value={formData.Status} onChange={(e) => setFormData({ ...formData, Status: e.target.value })}>
              <option value="En attente">En attente</option>
              <option value="Accepté">Accepté</option>
              <option value="Refusé">Refusé</option>
            </select>
          </p>
          <button className="save" onClick={handleSave}>Sauvegarder</button>
          <button className="cancel" onClick={handleCloseModal}>Annuler</button>
        </div>
      </Modal>
    </div>
  );
};

export default DevisAffichage;

