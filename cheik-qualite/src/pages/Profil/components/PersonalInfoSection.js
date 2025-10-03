import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const PersonalInfoSection = ({ user, formData, editMode, handleChange, handleFileChange, handleInfoSave, selectedFile, message, messageType }) => {
    return (
        <div className="profile-card">
            <div className="profile-avatar">
                <img src={formData.profilePictureUrl || "https://via.placeholder.com/150"} alt="Profil" />
                {editMode && (
                    <label htmlFor="profile-picture-upload" className="file-upload-label">
                        <FontAwesomeIcon icon={faCamera} /> Changer
                        <input type="file" id="profile-picture-upload" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>
            
            <div className="profile-info">
                <h3>Informations Personnelles</h3>
                <div className="info-group">
                    <label>Nom et Prénom</label>
                    {editMode ? <input type="text" name="name" value={formData.name || ''} onChange={handleChange} /> : <p>{user.name}</p>}
                </div>
                <div className="info-group">
                    <label>Email</label>
                    {editMode ? <input type="email" name="email" value={formData.email || ''} onChange={handleChange} /> : <p>{user.email}</p>}
                </div>
                <div className="info-group">
                    <label>Téléphone</label>
                    {editMode ? <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} /> : <p>{user.phone}</p>}
                </div>

                {editMode && (
                    <div className="edit-actions">
                        <button onClick={handleInfoSave} className="save-btn">Enregistrer les informations</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalInfoSection;
