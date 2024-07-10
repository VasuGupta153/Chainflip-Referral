import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import '../styles/ActiveCampaigns.css'

const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      isLive
    }
  }
`

const ActiveCampaigns = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_CAMPAIGNS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const campaigns = data.campaignCreateds

  return (
    <div className="active-campaigns">
      <h2>Active Campaigns</h2>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <h3>Campaign ID: {campaign.id}</h3>
            <p><strong>Creator:</strong> {campaign.creator}</p>
            <p><strong>Is Live:</strong> {campaign.isLive === "1" ? "Yes" : "No"}</p>
            <Link to={`/dashboard/${campaign.id}`} className="view-link">View Campaign</Link>
          </div>
        ))
      ) : (
        <p>No active campaigns found.</p>
      )}
    </div>
  );
};

export default ActiveCampaigns