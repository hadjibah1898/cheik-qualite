import React from 'react';

const SecuritySection = ({ editMode, passwordData, handlePasswordInputChange, handlePasswordSave }) => {
    if (!editMode) return null; // Only show in edit mode

    return (
        <div className="security-section">
            <h3>Sécurité</h3>
            <div className="info-group">
                <label>Mot de passe actuel</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} placeholder="••••••••" />
            </div>
            <div className="info-group">
                <label>Nouveau mot de passe</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} placeholder="••••••••" />
            </div>
            <div className="info-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} placeholder="••••••••" />
            </div>
            <div className="edit-actions">
                <button onClick={handlePasswordSave} className="save-password-btn">Changer le mot de passe</button>
            </div>
        </div>
    );
};

export default SecuritySection;
