import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Accueil from './pages/Accueil/index.js';
import ConseilSante from './pages/ConseilSante/index.js';
import Admin from './pages/Admin/index.js';
// import AgentDashboard from './pages/AgentDashboard/index.js'; // Import AgentDashboard
import ProduitsLocaux from './pages/ProduitsLocaux/index.js';
import Notifications from './pages/Notifications/index.js';
import Profil from './pages/Profil/index.js';
import Propos from './pages/Propos/index.js';
import Soumission from './pages/Soumission/index.js';
import AuthPage from './components/Login/AuthPage.js';
import VerificationProduit from './pages/VerificationProduit/index.js';
import RechercheAvancee from './pages/RechercheAvancee/index.js';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.js';
import SoumissionCertificat from './pages/SoumissionCertificat/index.js';
import Unauthorized from './pages/Unauthorized/index.js';
import Contact from './pages/Contact/index.js';
import DevenirAgentPage from './pages/DevenirAgent/index.js';
import Chatbot from './components/Chatbot/Chatbot.js';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Accueil />} />
          <Route path="/conseils" element={<ConseilSante />} />
          <Route path="/produits-locaux" element={<ProduitsLocaux />} />
          <Route path="/a-propos" element={<Propos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/devenir-agent" element={<DevenirAgentPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes for Standard Users */}
          <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'agent']} />}>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/soumission" element={<Soumission />} />
            <Route path="/verifier-produit" element={<VerificationProduit />} />
            <Route path="/recherche-avancee" element={<RechercheAvancee />} />
          </Route>

          {/* Protected Route for Agents
          <Route element={<PrivateRoute allowedRoles={['agent']} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
          </Route> */}

          {/* Protected Route for Admins */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/soumission-certificat" element={<SoumissionCertificat />} />
          </Route>
        </Routes>
        <Chatbot />
      </Layout>
    </Router>
  );
}

export default App;