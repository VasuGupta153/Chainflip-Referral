import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CampaignFactory from './contracts/CampaignFactory.json';
import Header from './components/Header';  // Import the new Header component
import CreateCampaign from './components/CreateCampaign';
import ActiveCampaigns from './components/ActiveCampaigns';
import UserDashboard from './components/UserDashboard';
import './styles/App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [campaignFactory, setCampaignFactory] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setSigner(signer);

        const factoryAddress = import.meta.env.VITE_CAMPAIGN_FACTORY_ADDRESS;
        const factory = new ethers.Contract(factoryAddress, CampaignFactory.abi, signer);
        setCampaignFactory(factory);
      } catch (error) {
        console.error("An error occurred", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  return (
    <Router>
      <div className="App">
        <Header account={account} connectWallet={connectWallet} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2 className="welcome-text">Welcome to ChainFlip Affiliate Program</h2>} />
            <Route path="/create" element={<CreateCampaign campaignFactory={campaignFactory} signer={signer} />} />
            <Route path="/active" element={<ActiveCampaigns campaignFactory={campaignFactory} signer={signer} />} />
            <Route path="/dashboard/:campaignAddress" element={<UserDashboard account={account} signer={signer} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
