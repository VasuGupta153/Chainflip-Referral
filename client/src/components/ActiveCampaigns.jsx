import { useQuery } from '@apollo/client'
import '../styles/ActiveCampaigns.css'
import React, { useState } from 'react';
import { GET_ACTIVE_CAMPAIGNS } from '../utils/queries'
import { ethers,BaseWallet } from 'ethers';
import abi from '../contracts/Campaign.json';
import { useAuth } from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom'

const ActiveCampaigns = ({campaignFactory, signer}) => {
  const { loading, error, data } = useQuery(GET_ACTIVE_CAMPAIGNS, {
    context: { clientName: 'campaign' }
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const { user} = useAuth();

  const navigate = useNavigate();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const campaigns = data.campaignCreateds;

  const handleViewCampaign = async (campaignM) => {
    // Create a provider
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);

    // Create a wallet instance using the platform's private key
    const privateKey = import.meta.env.VITE_PLATFORM_PRIVATE_KEY;
    // Create a wallet instance using the platform's private key
    const platformWallet = new ethers.Wallet(privateKey, provider); 
    // console.log(platformWallet);
    const campaign = new ethers.Contract(campaignM.campaignAddress, abi, signer);
    let result = await campaign.checkIfExpired(); 
    // console.log(result);
    if(!result)
      setSelectedCampaign(campaignM);
    else{
      alert(`Campaign has finished!`);
      console.log(`Campaign has finished!`);
      await campaignFactory.connect(platformWallet).stopExpiredCampaign(campaignM.campaignAddress);
      navigate('/active')
    }
  };
  const handleAuth = (campaign) => {
      if (!user) {
        alert('User data is not available yet.');
        return;
      }
      // console.log(user);
        if (!user.worldIDVerified) {
          navigate(`/worldid/${campaign.campaignAddress}`);
      } else if (!user.hasSwapped) {
        navigate(`/verified-user/${campaign.campaignAddress}`);
      } else {
        navigate(`/dashboard/${campaign.campaignAddress}`);
      }
    }

  return (
    <div className="active-campaigns">
      <h2>Active Campaigns</h2>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <h3>Campaign ID: {campaign.id}</h3>
            <p><strong>Creator:</strong> {campaign.creator}</p>
            <p><strong>Is Live:</strong> {campaign.isLive === "1" ? "Yes" : "No"}</p>
            {selectedCampaign && selectedCampaign.id === campaign.id ? (
              <>
                <div className="verification-section">
                  <p className="human-text">Human Verification</p>
                </div>
                <button onClick = {() => handleAuth(selectedCampaign)} className='view-link'> Verify </button>
              </>
            ) : (
              <button onClick={() => handleViewCampaign(campaign)} className="view-link">View Campaign</button>
            )}
          </div>
        ))
      ) : (
        <p>No active campaigns found.</p>
      )}
    </div>
  );
};

export default ActiveCampaigns
