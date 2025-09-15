import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profil.css';
import { AuthContext } from '../../context/AuthContext.js';

// Import des nouveaux sous-composants
import PersonalInfoSection from './components/PersonalInfoSection.js';
import HealthPreferencesSection from './components/HealthPreferencesSection.js';
import SecuritySection from './components/SecuritySection.js';

const predefinedHealthConditions = ["Diabétique", "Hypertendu", "Drépanocytaire", "Aucun"];

const Profil = () => {
    const { user: contextUser, loading: userLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    useEffect(() => {
        if (contextUser) {
            setUser(contextUser);
            setFormData(contextUser);
        }
    }, [contextUser]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (editMode) {
            setFormData(user);
            setSelectedFile(null);
            setMessage(null);
            setMessageType(null);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleHealthConditionChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            const currentConditions = prevFormData.healthConditions || [];
            if (checked) {
                if (value === "Aucun") return { ...prevFormData, healthConditions: ["Aucun"] };
                const newConditions = currentConditions.filter(c => c !== "Aucun");
                return { ...prevFormData, healthConditions: [...newConditions, value] };
            } else {
                return { ...prevFormData, healthConditions: currentConditions.filter((c) => c !== value) };
            }
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleInfoSave = async () => {
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Vous n'êtes pas authentifié.");

            let profilePictureUrl = formData.profilePictureUrl;
            if (selectedFile) {
                const formDataImage = new FormData();
                formDataImage.append('profilePicture', selectedFile);
                const uploadResponse = await fetch(`/api/user/upload-profile-picture`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formDataImage });
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || "Échec du téléchargement de l'image.");
                }
                const uploadData = await uploadResponse.json();
                profilePictureUrl = uploadData.profilePictureUrl;
            }

            const response = await fetch(`/api/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...formData, profilePictureUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la mise à jour du profil.');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditMode(false);
            setSelectedFile(null);
            setMessage('Informations mises à jour avec succès !');
            setMessageType('success');
        } catch (error) {
            setMessage(error.message || 'Une erreur inattendue est survenue.');
            setMessageType('error');
        }
    };

    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
            setMessageType('error');
            return;
        }
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setMessage("Veuillez remplir tous les champs de mot de passe.");
            setMessageType('error');
            return;
        }

        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(passwordData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            setMessage(data.message);
            setMessageType('success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage(error.message);
            setMessageType('error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (userLoading) {
        return <div className="profile-container loading"><span className="loading-spinner"></span> Chargement...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Bonjour, {user.name ? user.name.split(' ')[0] : 'Utilisateur'}!</h2>
                <p>Gérez vos informations personnelles et vos préférences.</p>
            </div>
            
            {message && <div className={`form-message ${messageType}`}>{message}</div>}

            <PersonalInfoSection
                user={user}
                formData={formData}
                editMode={editMode}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleInfoSave={handleInfoSave}
                selectedFile={selectedFile}
                message={message}
                messageType={messageType}
            />

            <HealthPreferencesSection
                user={user}
                formData={formData}
                editMode={editMode}
                handleHealthConditionChange={handleHealthConditionChange}
                predefinedHealthConditions={predefinedHealthConditions}
            />

            <SecuritySection
                editMode={editMode}
                passwordData={passwordData}
                handlePasswordInputChange={handlePasswordInputChange}
                handlePasswordSave={handlePasswordSave}
            />

            <div className="profile-actions">
                {!editMode ? (
                    <button onClick={handleEditToggle} className="edit-btn"><i className="fas fa-edit"></i> Modifier le profil</button>
                ) : (
                    <button onClick={handleEditToggle} className="cancel-btn">Annuler les modifications</button>
                )}

                <button onClick={handleLogout} className="logout-btn-profile">Déconnexion</button>
            </div>
        </div>
    );
};

export default Profil;