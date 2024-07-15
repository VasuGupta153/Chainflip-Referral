// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useConnectWallet, useCampaignFactory } from './utils/config';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import CreateCampaign from './components/CreateCampaign';
import ActiveCampaigns from './components/ActiveCampaigns';
import WorldID from './components/WorldID';
import VerifiedUserPage from './components/VerifiedUserPage';
import UserDashboard from './components/UserDashboard';
import './styles/App.css';

function App() {
  const {signer, account, isWalletConnected,connectWallet} = useConnectWallet();
  const campaignFactory = useCampaignFactory(import.meta.env.VITE_CAMPAIGN_FACTORY_ADDRESS,signer);
  // console.log(signer);
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header account={account} connectWallet={connectWallet} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<h2 className="welcome-text">Welcome to ChainFlip Affiliate Program</h2>} />
              <Route path="/create" element={
                  <CreateCampaign campaignFactory={campaignFactory} signer={signer} isWalletConnected={isWalletConnected} />
              } />
              <Route path="/active" element={<ActiveCampaigns campaignFactory={campaignFactory} signer={signer} />} />
              <Route 
                path="/worldid/:campaignAddress" 
                element={
                    <WorldID />
                } 
              />
              <Route 
                path="/verified-user/:campaignAddress" 
                element={
                  <ProtectedRoute requiredAuth="worldID">
                    <VerifiedUserPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/:campaignAddress" 
                element={
                  <ProtectedRoute requiredAuth="swap">
                    <UserDashboard account={account} signer={signer} />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;