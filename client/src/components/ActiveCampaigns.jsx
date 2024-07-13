import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import '../styles/ActiveCampaigns.css'
import WorldID from './WorldID'
import React, { useState } from 'react';
import VerifiedUserPage from './VerifiedUserPage';


const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      isLive
      campaignAddress
    }
  }
`;

const ActiveCampaigns = ({campaignFactory, signer}) => {
  const { loading, error, data } = useQuery(GET_ACTIVE_CAMPAIGNS, {
    context: { clientName: 'campaign' }
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const campaigns = data.campaignCreateds;

  const handleViewCampaign = async (campaign) => {
    // Create a provider
    const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);

    // Create a wallet instance using the platform's private key
    const platformWallet = new ethers.Wallet(import.meta.env.VITE_PLATFORM_PRIVATE_KEY, provider);

    if(! (await campaign.checkIfExpired()))
      setSelectedCampaign(campaign);
    else{
      alert(`Campaign has finished!`);
      console.log(`Campaign has finished!`);
      await campaignFactory.connect(platformWallet).stopExpiredCampaign(campaign.address);
    }
  };


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
                <WorldID campaign={campaign} signer={signer}/>
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
