import { ethers } from 'ethers'

const CampaignList = ({ campaigns }) => {
  return (
    <div>
      <h2>Active Campaigns</h2>
      {campaigns.map((campaign, index) => (
        <div key={index}>
          <h3>{campaign.name}</h3>
          <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
          <p>Total Reward: {ethers.utils.formatEther(campaign.totalRewardAmount)} FLIP</p>
          <p>Reward Per Referral: {ethers.utils.formatEther(campaign.rewardPerReferral)} FLIP</p>
        </div>
      ))}
    </div>
  )
}

export default CampaignList