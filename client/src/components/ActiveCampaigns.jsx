import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import '../styles/ActiveCampaigns.css'
import WorldID from './WorldID'


const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      isLive
      campaignAddress
    }
  }
`

const ActiveCampaigns = ({campaignFactory, signer}) => {
  const { loading, error, data } = useQuery(GET_ACTIVE_CAMPAIGNS)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const campaigns = data.campaignCreateds

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign.id)
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
            {selectedCampaign !== campaign.id ? (
              <button onClick={() => handleViewCampaign(campaign)} className="view-link">View Campaign</button>
            ) : (
              <>
                <div className="verification-section">
                  <p className="human-text">Human Verification</p>
                </div>
                <WorldID campaignAddress = {campaign.addresss} signer={signer}/>
              </>
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
