import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CampaignFactory from './contracts/CampaignFactory.json';
import Header from './components/Header';
import CreateCampaign from './components/CreateCampaign';
import ActiveCampaigns from './components/ActiveCampaigns';
import UserDashboard from './components/UserDashboard';
import './styles/App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [campaignFactory, setCampaignFactory] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setSigner(signer);
        setIsWalletConnected(true);
        const factoryAddress = import.meta.env.VITE_CAMPAIGN_FACTORY_ADDRESS;
        console.log("Factory Address:", factoryAddress); // Add this log
        if (!factoryAddress) {
          throw new Error("Campaign Factory address is not set");
        }
        const factory = new ethers.Contract(factoryAddress, CampaignFactory, signer);
        setCampaignFactory(factory);
        
        console.log("Wallet connected successfully");
      } catch (error) {
        console.error("An error occurred", error);
        setIsWalletConnected(false);
        setCampaignFactory(null);
      }
    } else {
      console.log("Please install MetaMask!");
      setIsWalletConnected(false);
      setCampaignFactory(null);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
  
    checkWalletConnection();
  }, []);

  useEffect(() => {
    console.log("Wallet connection state:", isWalletConnected);
    console.log("Campaign Factory:", campaignFactory);
    console.log("Signer:", signer);
  }, [isWalletConnected, campaignFactory, signer]);

  return (
    <Router>
      <div className="App">
        <Header account={account} connectWallet={connectWallet} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2 className="welcome-text">Welcome to ChainFlip Affiliate Program</h2>} />
            <Route 
              path="/create" 
              element={
                <CreateCampaign 
                  campaignFactory={campaignFactory} 
                  signer={signer} 
                  isWalletConnected={isWalletConnected}
                />
              } 
            />
            <Route path="/active" element={<ActiveCampaigns campaignFactory={campaignFactory} signer={signer} />} />
            <Route path="/dashboard/:campaignAddress" element={<UserDashboard account={account} signer={signer} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;