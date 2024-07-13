import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useConnectWallet, useCampaignFactory } from './utlis/config'; // Import the useWallet hook
import Header from './components/Header';
import CreateCampaign from './components/CreateCampaign';
import ActiveCampaigns from './components/ActiveCampaigns';
import UserDashboard from './components/UserDashboard';
import './styles/App.css';
import VerifiedUserPage from './components/VerifiedUserPage';

function App() {
  const {signer,account,isWalletConnected} = useConnectWallet();
  const campaignFactory = useCampaignFactory(signer);
  return (
    <Router>
      <div className="App">
        <Header account={account} connectWallet={useConnectWallet} />
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
            <Route path="/verified-user/:campaignAddress" element={<VerifiedUserPage />} />
            <Route path="/dashboard/:campaignAddress" element={<UserDashboard account={account} signer={signer} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
