import React, { useState, useEffect } from 'react';
import './GestionAgents.css';
import { toast } from 'react-toastify';

const GestionAgents = () => {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAgent, setCurrentAgent] = useState({ id: null, name: '', email: '', region: '', status: 'Actif' });

    const API_URL = 'http://localhost:5000/api'; // Assurez-vous que l'URL est correcte

    // Fetch agents from the backend
    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/agent-applications`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Erreur lors de la récupération des agents');
            const data = await response.json();
            setAgents(data);
        } catch (error) {
            toast.error(error.message || 'Impossible de charger les agents.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAgent({ ...currentAgent, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/agents/${currentAgent._id}` : `${API_URL}/agents`;

        // Ne pas envoyer le mot de passe vide lors de la modification
        const agentData = { ...currentAgent };
        if (isEditing && !agentData.password) {
            delete agentData.password;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(agentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue.');
            }

            toast.success(`Agent ${isEditing ? 'mis à jour' : 'ajouté'} avec succès !`);
            fetchAgents(); // Refresh the list
            resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (agent) => {
        setIsEditing(true);
        setCurrentAgent({ ...agent, password: '' }); // Ne pas afficher le mot de passe existant
        setShowAddForm(true);
    };

    const handleDelete = async (agentId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/agents/${agentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erreur lors de la suppression.');
                }

                toast.success('Agent supprimé avec succès.');
                fetchAgents(); // Refresh the list
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentAgent({ id: null, name: '', email: '', region: '', status: 'Actif', password: '' });
        setShowAddForm(false);
    };

    if (isLoading) {
        return <p>Chargement des agents...</p>;
    }

    return (
        <div className="gestion-agents-container">
            <h3>Gestion des Agents de Terrain</h3>
            <p>Ajoutez, modifiez ou désactivez les comptes des agents de contrôle qualité.</p>

            {!showAddForm && (
                <button onClick={() => { setShowAddForm(true); setIsEditing(false); }} className="add-agent-btn">
                    Ajouter un nouvel agent
                </button>
            )}

            {showAddForm && (
                <form onSubmit={handleSubmit} className="add-agent-form">
                    <h4>{isEditing ? 'Modifier l\'agent' : 'Nouvel Agent'}</h4>
                    <div className="form-group">
                        <label>Nom Complet</label>
                        <input type="text" name="name" value={currentAgent.name} onChange={handleInputChange} placeholder="Nom de l'agent" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={currentAgent.email} onChange={handleInputChange} placeholder="Email de l'agent" required />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe {isEditing ? '(Laissez vide pour ne pas changer)' : ''}</label>
                        <input type="password" name="password" value={currentAgent.password || ''} onChange={handleInputChange} placeholder="Mot de passe" required={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label>Région d'affectation</label>
                        <select name="region" value={currentAgent.region} onChange={handleInputChange} required>
                            <option value="">Sélectionner une région</option>
                            <option value="Conakry">Conakry</option>
                            <option value="Kindia">Kindia</option>
                            <option value="Labé">Labé</option>
                            <option value="Kankan">Kankan</option>
                            <option value="N'Zérékoré">N'Zérékoré</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Statut</label>
                        <select name="status" value={currentAgent.status} onChange={handleInputChange}>
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit">{isEditing ? 'Mettre à jour' : 'Enregistrer'}</button>
                        <button type="button" onClick={resetForm}>Annuler</button>
                    </div>
                </form>
            )}

            <div className="agents-list">
                <h4>Liste des Agents</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Région</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.length > 0 ? agents.map(agent => (
                            <tr key={agent._id}>
                                <td>{agent.name}</td>
                                <td>{agent.email}</td>
                                <td>{agent.region}</td>
                                <td>
                                    <span className={`status-badge ${agent.status === 'Actif' ? 'status-actif' : 'status-inactif'}`}>
                                        {agent.status}
                                    </span>
                                </td>
                                <td className="agent-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(agent)}>Modifier</button>
                                    <button className="delete-btn" onClick={() => handleDelete(agent._id)}>Supprimer</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>Aucun agent trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionAgents;