import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import Campaign from '../contracts/Campaign.json'
import '../styles/ActiveCampaigns.css'

const ActiveCampaigns = ({ campaignFactory, signer }) => {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (campaignFactory && signer) {
        const campaignCount = await campaignFactory.campaignCount()
        const loadedCampaigns = []
        for (let i = 0; i < campaignCount; i++) {
          const campaignAddress = await campaignFactory.campaigns(i)
          const campaign = new ethers.Contract(campaignAddress, Campaign.abi, signer)
          const campaignData = await campaign.getCampaignData()
          loadedCampaigns.push({ address: campaignAddress, ...campaignData })
        }
        setCampaigns(loadedCampaigns)
      }
    }

    fetchCampaigns()
  }, [campaignFactory, signer])

  return (
    <div className="active-campaigns">
      <h2>Active Campaigns</h2>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.address} className="campaign-card">
            <h3>{campaign.name}</h3>
            <p><strong>Deadline:</strong> {new Date(campaign.deadline * 1000).toLocaleString()}</p>
            <p><strong>Total Reward Amount:</strong> {ethers.utils.formatEther(campaign.totalRewardAmount)} ETH</p>
            <p><strong>Reward Per Referral:</strong> {ethers.utils.formatEther(campaign.rewardPerReferral)} ETH</p>
            <Link to={`/dashboard/${campaign.address}`} className="view-link">View Campaign</Link>
          </div>
        ))
      ) : (
        <p>No active campaigns found.</p>
      )}
    </div>
  );
};

export default ActiveCampaigns
