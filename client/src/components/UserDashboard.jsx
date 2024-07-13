import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useParams } from 'react-router-dom'


const UserDashboard = ({ campaign, signer }) => {
  const [campaignData, setCampaignData] = useState(null)
  const { campaignAddress } = useParams()

  useEffect(() => {
    const fetchCampaignData = async () => {
      console.log(campaignAddress);
      if (signer && campaignAddress) {

        const campaign = new ethers.Contract(campaignAddress, CampaignAbi, signer)
        const [hasParticipated, referralCount, referralCode] = await campaign.getParticipantInfo(account)
        const campaignInfo = await campaign.getCampaignData()
        setCampaignData({ 
          ...campaignInfo, 
          hasParticipated, 
          referralCount, 
          referralCode,
          address: campaignAddress
        })
      }
    }

    fetchCampaignData()
  }, [account, signer])

 

  return (
    <div>
      { !campaignData ? (
        <div>Loading...</div>
      ):(
      <div className="campaign-card">
        <h2>Campaign Dashboard: {campaignData.name}</h2>
        <p>Campaign Address: {campaignData.address}</p>
        <p>Deadline: {new Date(campaignData.deadline * 1000).toLocaleString()}</p>
        <p>Total Reward: {ethers.formatEther(campaignData.totalRewardAmount)} FLIP</p>
        <p>Reward Per Referral: {ethers.formatEther(campaignData.rewardPerReferral)} FLIP</p>
        {campaignData.hasParticipated ? (
          <>
            <p>Your Referral Count: {campaignData.referralCount.toString()}</p>
            <p>Your Referral Code: {campaignData.referralCode}</p>
            <p>Your Estimated Earnings: {ethers.formatEther(campaignData.rewardPerReferral.mul(campaignData.referralCount))} FLIP</p>
          </>
        ) : (
          <p>You haven't participated in this campaign yet.</p>
        )}
      </div>
      )}
    </div>
  )
}

export default UserDashboard