import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Accueil from './pages/Accueil/index.js';
import ConseilSante from './pages/ConseilSante/index.js';
import Admin from './pages/Admin/index.js';
import ProduitsLocaux from './pages/ProduitsLocaux/index.js';
import Notifications from './pages/Notifications/index.js';
import Profil from './pages/Profil/index.js';
import Propos from './pages/Propos/index.js';
import Soumission from './pages/Soumission/index.js';
import AuthPage from './components/Login/AuthPage.js';
import VerificationProduit from './pages/VerificationProduit/index.js';
import RechercheAvancee from './pages/RechercheAvancee/index.js';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.js';
import SoumissionCertificat from './pages/SoumissionCertificat/index.js'; // Import the new page
import Unauthorized from './pages/Unauthorized/index.js'; // Import the new Unauthorized page
import Contact from './pages/Contact/index.js';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/conseils" element={<ConseilSante />} />
          <Route path="/produits-locaux" element={<ProduitsLocaux />} />
          <Route path="/a-propos" element={<Propos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} /> {/* Unauthorized page */}

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/soumission" element={<Soumission />} />
            <Route path="/verifier-produit" element={<VerificationProduit />} />
            <Route path="/recherche-avancee" element={<RechercheAvancee />} />
          </Route>

          {/* Admin protected routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/soumission-certificat" element={<SoumissionCertificat />} /> {/* New admin page */}
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;