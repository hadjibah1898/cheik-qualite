import React, { useState } from "react";

export default function MagazinesTab() {
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    maladie: "",
    telephone: "",
    date: "",
    time: "",
    consultation: ""
  });

  const dieteticiennes = [
    {
      name: "Dr. Aïssatou Bah",
      niveau: "Master en Nutrition et Diététique",
      specialite: "Spécialiste du diabète et de l’hypertension",
      bio: "Passionnée par la prévention des maladies métaboliques, Dr. Bah accompagne depuis plus de 5 ans les patients diabétiques et hypertendus pour une meilleure qualité de vie.",
      photo:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      forfait: "30 000 GNF"
    },
    {
      name: "Dr. Mariama Diallo",
      niveau: "Doctorat en Sciences Nutritionnelles",
      specialite: "Spécialiste de la drépanocytose",
      bio: "Chercheuse et clinicienne, Dr. Diallo développe des programmes nutritionnels adaptés aux patients drépanocytaires afin d’améliorer leur santé et leur bien-être au quotidien.",
      photo:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      forfait: "40 000 GNF"
    },
    {
      name: "Dr. Fatoumata Camara",
      niveau: "Licence en Diététique",
      specialite: "Spécialiste en perte de poids saine",
      bio: "Avec une approche personnalisée, Dr. Camara aide ses patients à atteindre un poids santé grâce à des régimes équilibrés et durables, sans mettre en danger leur bien-être.",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      forfait: "25 000 GNF"
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Merci ${formData.nom} ! Votre rendez-vous avec ${selectedDiet.name} est demandé pour le ${formData.date} à ${formData.time}.
Type: ${formData.consultation} | Forfait: ${selectedDiet.forfait}`
    );
    setFormData({
      nom: "",
      email: "",
      maladie: "",
      telephone: "",
      date: "",
      time: "",
      consultation: ""
    });
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        header {
          text-align: center;
          margin-bottom: 20px;
        }
        .diet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .diet-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: 0.3s;
        }
        .diet-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .diet-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .diet-form {
          background: #fff;
          margin-top: 30px;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .diet-form img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto;
          border: 3px solid green;
        }
        .diet-form h2 {
          text-align: center;
          color: green;
          margin-top: 10px;
        }
        .diet-form label {
          display: block;
          font-weight: bold;
          margin-top: 10px;
        }
        .diet-form input,
        .diet-form textarea,
        .diet-form select {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .diet-form button {
          margin-top: 15px;
          width: 100%;
          padding: 10px;
          border: none;
          background: green;
          color: white;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
        }
        .diet-form button:hover {
          background: darkgreen;
        }
        footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }
      `}</style>

      <header>
        <h1>Choisissez votre Diététicienne</h1>
        <p>Cliquez sur une diététicienne pour prendre rendez-vous</p>
      </header>

      {/* Liste des diététiciennes */}
      <div className="diet-list">
        {dieteticiennes.map((diet, index) => (
          <div
            key={index}
            onClick={() => setSelectedDiet(diet)}
            className="diet-card"
          >
            <img src={diet.photo} alt={diet.name} />
            <h3>{diet.name}</h3>
            <p><strong>Niveau :</strong> {diet.niveau}</p>
            <p><strong>Spécialité :</strong> {diet.specialite}</p>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      {selectedDiet && (
        <div className="diet-form">
          <img src={selectedDiet.photo} alt={selectedDiet.name} />
          <h2>{selectedDiet.name}</h2>
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            {selectedDiet.bio}
          </p>

          <form onSubmit={handleSubmit}>
            <label>Nom & Prénom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />

            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Maladie ou condition *</label>
            <textarea
              name="maladie"
              value={formData.maladie}
              onChange={handleChange}
              required
            ></textarea>

            <label>Téléphone *</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />

            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label>Heure *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label>Type de consultation *</label>
            <select
              name="consultation"
              value={formData.consultation}
              onChange={handleChange}
              required
            >
              <option value="">-- Choisir --</option>
              <option value="Présentiel">Présentiel</option>
              <option value="En ligne">En ligne</option>
            </select>

            <label>Forfait consultation</label>
            <input type="text" value={selectedDiet.forfait} readOnly />

            <button type="submit">Demander un rendez-vous</button>
          </form>
        </div>
      )}

      <footer>
        © {new Date().getFullYear()} Service Nutrition Guinée
      </footer>
    </div>
  );
}