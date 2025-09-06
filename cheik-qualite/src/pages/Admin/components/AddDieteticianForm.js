import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AddDieteticianForm.css';

const AddDieteticianForm = () => {
    const [name, setName] = useState('');
    const [niveau, setNiveau] = useState('');
    const [specialite, setSpecialite] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState(null);
    const [forfait, setForfait] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('niveau', niveau);
        formData.append('specialite', specialite);
        formData.append('bio', bio);
        formData.append('forfait', forfait);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/dietitians', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setName('');
                setNiveau('');
                setSpecialite('');
                setBio('');
                setPhoto(null);
                setForfait('');
            } else {
                toast.error(`Erreur: ${data.message || 'Quelque chose s\'est mal passé.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du diététicien:', error);
            toast.error('Erreur lors de la connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-dietetician-form-container">
            <h3>Ajouter un Nouveau Diététicien</h3>
            <form onSubmit={handleSubmit} className="add-dietetician-form">
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="niveau">Niveau</label>
                    <input
                        type="text"
                        id="niveau"
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specialite">Spécialité</label>
                    <input
                        type="text"
                        id="specialite"
                        value={specialite}
                        onChange={(e) => setSpecialite(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Biographie</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="forfait">Forfait (GNF)</label>
                    <input
                        type="text"
                        id="forfait"
                        value={forfait}
                        onChange={(e) => setForfait(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="photo">Photo</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Ajout en cours...' : 'Ajouter le Diététicien'}
                </button>
            </form>
        </div>
    );
};

export default AddDieteticianForm;
