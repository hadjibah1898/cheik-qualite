import React from 'react';

const HealthPreferencesSection = ({ user, formData, editMode, handleHealthConditionChange, predefinedHealthConditions }) => {
    return (
        <div className="health-preferences">
            <h3>Préférences de santé</h3>
            {editMode ? (
                <div className="checkbox-group">
                    {predefinedHealthConditions.map((condition) => (
                        <label key={condition}>
                            <input type="checkbox" name="healthConditions" value={condition} checked={formData.healthConditions?.includes(condition)} onChange={handleHealthConditionChange} />
                            {condition}
                        </label>
                    ))}
                </div>
            ) : (
                <div className="preference-list">
                    {user.healthConditions?.length > 0 ? user.healthConditions.map((c, i) => <span key={i} className="preference-item">{c}</span>) : <p>Aucune préférence enregistrée.</p>}
                </div>
            )}
        </div>
    );
};

export default HealthPreferencesSection;
