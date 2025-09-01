import React, { useState, useEffect } from 'react';
import './Profil.css';

const predefinedHealthConditions = ["Diabétique", "Hypertendu", "Drépanocytaire", "Aucun"];

const Profil = () => {
    const [user, setUser] = useState({}); // Initialize as empty, data will be fetched
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({}); // To hold changes during editing
    const [selectedFile, setSelectedFile] = useState(null); // For profile picture upload
    const [message, setMessage] = useState(null); // For success/error messages
    const [messageType, setMessageType] = useState(null); // 'success' or 'error'

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Handle case where token is not found (e.g., redirect to login)
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUser(data);
                setFormData(data); // Initialize formData with fetched user data
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // Handle error (e.g., display error message to user)
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleEditToggle = () => {
        setEditMode(!editMode);
        // If exiting edit mode, reset formData to current user data
        if (editMode) {
            setFormData(user);
            setSelectedFile(null); // Clear selected file when exiting edit mode
            setMessage(null); // Clear messages when exiting edit mode
            setMessageType(null); // Clear message type
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleHealthConditionChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            const currentConditions = prevFormData.healthConditions || [];
            if (checked) {
                // If "Aucun" is selected, deselect all others
                if (value === "Aucun") {
                    return { ...prevFormData, healthConditions: ["Aucun"] };
                }
                // If any other condition is selected, deselect "Aucun"
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

    const handleSave = async () => {
        setMessage(null); // Clear previous messages
        setMessageType(null); // Clear previous message type

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage("Vous n'êtes pas authentifié. Veuillez vous connecter.");
                setMessageType('error');
                return;
            }

            let profilePictureUrl = user.profilePictureUrl; // Start with existing URL

            if (selectedFile) {
                const formDataImage = new FormData();
                formDataImage.append('profilePicture', selectedFile);

                const uploadResponse = await fetch('http://localhost:5000/api/user/upload-profile-picture', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formDataImage,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Échec du téléchargement de limage de profil.');
                }

                const uploadData = await uploadResponse.json();
                profilePictureUrl = uploadData.profilePictureUrl; // Get new URL from backend
            }

            // Now save the rest of the profile data, including the (potentially new) profile picture URL
            const response = await fetch('http://localhost:5000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, profilePictureUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la mise à jour du profil utilisateur.');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditMode(false);
            setSelectedFile(null); // Clear selected file after successful save
            setMessage('Profil mis à jour avec succès !');
            setMessageType('success');
        } catch (error) {
            console.error('Error updating user profile:', error);
            setMessage(error.message || 'Une erreur inattendue est survenue.');
            setMessageType('error');
        }
    };

    const handleCancel = () => {
        setFormData(user); // Revert changes
        setEditMode(false);
        setSelectedFile(null); // Clear selected file on cancel
        setMessage(null); // Clear messages on cancel
        setMessageType(null); // Clear message type
    };

    if (loading) {
        return (
            <div className="profile-container loading">
                <span className="loading-spinner"></span> Chargement du profil...
            </div>
        );
    }

    return (
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <h2>Bonjour, {user.name ? user.name.split(' ')[0] : 'Utilisateur'}!</h2>
                    <p>Votre tableau de bord personnel</p>
                </div>
                
                {message && (
                    <div className={`form-message ${messageType}`}>
                        {messageType === 'success' && <i className="fas fa-check-circle"></i>}
                        {messageType === 'error' && <i className="fas fa-exclamation-circle"></i>}
                        {message}
                    </div>
                )}

                <div className="profile-card">
                    <div className="profile-avatar">
                        <img src={user.profilePictureUrl || "https://via.placeholder.com/150"} alt="Profil" />
                        {editMode && (
                            <label htmlFor="profile-picture-upload" className="file-upload-label">
                                <i className="fas fa-camera"></i> Changer la photo
                                <input type="file" id="profile-picture-upload" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                    
                    <div className="profile-info">
                        <h3>Informations de contact</h3>
                        <div className="info-group">
                            <label>Nom et Prénom</label>
                            {editMode ? (
                                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Email</label>
                            {editMode ? (
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                            ) : (
                                <p>{user.email}</p>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Téléphone</label>
                            {editMode ? (
                                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                            ) : (
                                <p>{user.phone}</p>
                            )}
                        </div>

                        <div className="health-preferences">
                            <h3>Préférences de santé</h3>
                            {editMode ? (
                                <div className="checkbox-group">
                                    {predefinedHealthConditions.map((condition) => (
                                        <label key={condition}>
                                            <input
                                                type="checkbox"
                                                name="healthConditions"
                                                value={condition}
                                                checked={formData.healthConditions && formData.healthConditions.includes(condition)}
                                                onChange={handleHealthConditionChange}
                                            />
                                            {condition}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="preference-list">
                                    {user.healthConditions && user.healthConditions.map((condition, index) => (
                                        <span key={index} className="preference-item">{condition}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {editMode ? (
                            <div className="edit-actions">
                                <button onClick={handleSave} className="save-btn">Enregistrer</button>
                                <button onClick={handleCancel} className="cancel-btn">Annuler</button>
                            </div>
                        ) : (
                            <button onClick={handleEditToggle} className="edit-btn">
                                <i className="fas fa-edit"></i> Modifier le profil
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profil;