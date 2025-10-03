import React, { useState, useEffect } from 'react';
import './GestionAgents.css';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">Annuler</button>
                    <button onClick={onConfirm} className="btn btn-danger">Confirmer</button>
                </div>
            </div>
        </div>
    );
};

const GestionAgents = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState({ isOpen: false, message: '', onConfirm: null });

    const API_URL = 'http://localhost:5000/api';

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/agent-applications`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erreur lors de la récupération des candidatures');
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            toast.error(error.message || 'Impossible de charger les candidatures.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleUpdateStatus = (id, status) => {
        const actionText = status === 'approved' ? 'approuver' : 'rejeter';
        setModalState({
            isOpen: true,
            message: `Êtes-vous sûr de vouloir ${actionText} cette candidature ?`,
            onConfirm: () => confirmUpdateStatus(id, status),
        });
    };

    const confirmUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/agent-applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue.');
            }

            toast.success(`Candidature ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès !`);
            fetchApplications(); // Refresh the list
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const handleDeleteApplication = (id) => {
        setModalState({
            isOpen: true,
            message: 'Êtes-vous sûr de vouloir supprimer définitivement cette candidature ?',
            onConfirm: () => confirmDeleteApplication(id),
        });
    };

    const confirmDeleteApplication = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/agent-applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue lors de la suppression.');
            }

            toast.success('Candidature supprimée avec succès !');
            fetchApplications(); // Refresh the list
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const closeModal = () => {
        setModalState({ isOpen: false, message: '', onConfirm: null });
    };

    if (isLoading) {
        return <p>Chargement des candidatures...</p>;
    }

    return (
        <>
            <ConfirmationModal 
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onConfirm={modalState.onConfirm}
                message={modalState.message}
            />
            <div className="gestion-agents-container">
                <h3>Gestion des Candidatures d'Agents</h3>
                <p>Approuvez ou rejetez les nouvelles candidatures pour devenir agent de terrain.</p>

                <div className="agents-list">
                    <h4>Liste des Candidatures</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Complet</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Région</th>
                                <th style={{minWidth: '200px'}}>Motivations</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length > 0 ? applications.map(app => (
                                <tr key={app._id}>
                                    <td>{app.fullName}</td>
                                    <td>{app.email}</td>
                                    <td>{app.phone}</td>
                                    <td>{app.region}</td>
                                    <td>{app.motivation}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="agent-actions">
                                        {app.status === 'pending' && (
                                            <>
                                                <button className="approve-btn" onClick={() => handleUpdateStatus(app._id, 'approved')}>Approuver</button>
                                                <button className="reject-btn" onClick={() => handleUpdateStatus(app._id, 'rejected')}>Rejeter</button>
                                            </>
                                        )}
                                        <button className="delete-btn" onClick={() => handleDeleteApplication(app._id)}>Supprimer</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>Aucune candidature trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default GestionAgents;
