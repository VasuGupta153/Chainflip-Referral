// ActiveCampaigns.js
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import '../styles/ActiveCampaigns.css';
import VerifiedUserPage from './VerifiedUserPage';

const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      isLive
    }
  }
`;

const ActiveCampaigns = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_CAMPAIGNS, {
    context: { clientName: 'campaign' }
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const campaigns = data.campaignCreateds;

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
  };

  if (selectedCampaign) {
    return (
      <VerifiedUserPage
        userAddress="0x7834de6c54e729cfc309be642c648df760175b36" // Replace with actual user address
        campaignStartTime={ Math.floor(new Date('2024-07-03T19:35:54+00:00').getTime())/1000}
        // campaignStartTime={parseInt("2024-02-07T17:01:42.001+00:00")}
        onBack={() => setSelectedCampaign(null)}
      />
    );
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
            <button onClick={() => handleViewCampaign(campaign)} className="view-link">
              View Campaign
            </button>
          </div>
        ))
      ) : (
        <p>No active campaigns found.</p>
      )}
    </div>
  );
};

export default ActiveCampaigns;