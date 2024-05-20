import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../supabase';
import Menu from '../Menu/Menu';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Client: '',
    Adresse: '',
    CodePostal: '',
    Ville: '',
    ComplementAdresse: '',
    Email: '',
    Telephone: '',
  });

  const fetchClients = useCallback(async () => {
    const { data, error } = await supabase.from('Clients').select('*');
    if (!error) {
      setClients(data);
    } else {
      console.error('Erreur lors du chargement des clients', error.message);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      Nom: '',
      Prenom: '',
      Client: '',
      Adresse: '',
      CodePostal: '',
      Ville: '',
      ComplementAdresse: '',
      Email: '',
      Telephone: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const existingClient = clients.find(client => client.Email === formData.Email);
    if (existingClient) {
      alert('Ce client existe déjà.');
      return;
    }
    const { error } = await supabase.from('Clients').insert([formData]);
    if (!error) {
      fetchClients();
      closeModal();
    } else {
      console.error('Erreur lors de l\'ajout du client', error.message);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Clients').delete().match({ id });
    if (!error) {
      setClients(clients.filter(client => client.id !== id));
    } else {
      console.error('Erreur lors de la suppression', error.message);
    }
  };

  const filteredClients = clients.filter(client =>
    client.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.Prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-client">
      <Menu />
      <div className="client-container">
        <h1>Gestion des Clients</h1>
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
        <div className="buttons-container">
          <button className="add-btn" onClick={openModal}>Ajouter un Client</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Client</th>
                <th>Adresse</th>
                <th>Code Postal</th>
                <th>Ville</th>
                <th>Complément d'Adresse</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.Nom}</td>
                  <td>{client.Prenom}</td>
                  <td>{client.Client}</td>
                  <td>{client.Adresse}</td>
                  <td>{client.CodePostal}</td>
                  <td>{client.Ville}</td>
                  <td>{client.ComplementAdresse}</td>
                  <td>{client.Email}</td>
                  <td>{client.Telephone}</td>
                  <td>
                    <button className="delete-btn action-btn" onClick={() => handleDelete(client.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <h2>Ajouter un Client</h2>
          <form onSubmit={handleFormSubmit}>
            <input type="text" name="Nom" placeholder="Nom" value={formData.Nom} onChange={handleInputChange} required />
            <input type="text" name="Prenom" placeholder="Prénom" value={formData.Prenom} onChange={handleInputChange} required />
            <input type="text" name="Client" placeholder="Client" value={formData.Client} onChange={handleInputChange} required />
            <input type="text" name="Adresse" placeholder="Adresse" value={formData.Adresse} onChange={handleInputChange} required />
            <input type="text" name="CodePostal" placeholder="Code Postal" value={formData.CodePostal} onChange={handleInputChange} required />
            <input type="text" name="Ville" placeholder="Ville" value={formData.Ville} onChange={handleInputChange} required />
            <input type="text" name="ComplementAdresse" placeholder="Complément d'Adresse" value={formData.ComplementAdresse} onChange={handleInputChange} />
            <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleInputChange} required />
            <input type="tel" name="Telephone" placeholder="Téléphone" value={formData.Telephone} onChange={handleInputChange} required />
            <button type="submit" className="save-btn action-btn">Ajouter</button>
            <button type="button" className="cancel-btn action-btn" onClick={closeModal}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Clients;
