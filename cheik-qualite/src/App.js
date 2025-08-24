import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Accueil from './pages/Accueil';
import ConseilSante from './pages/ConseilSante';
import Admin from './pages/Admin';
import ProduitsLocaux from './pages/ProduitsLocaux';
import Notifications from './pages/Notifications';
import Profil from './pages/Profil';
import Propos from './pages/Propos';
import Soumission from './pages/Soumission';
import AuthPage from './components/Login/AuthPage';
import VerificationProduit from './pages/VerificationProduit';
import RechercheAvancee from './pages/RechercheAvancee';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/conseils" element={<ConseilSante />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/produits-locaux" element={<ProduitsLocaux />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/a-propos" element={<Propos />} />
          <Route path="/soumission" element={<Soumission />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/verifier-produit" element={<VerificationProduit />} />
          <Route path="/recherche-avancee" element={<RechercheAvancee />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
