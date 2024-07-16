// UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet, useCampaign } from "../utils/config";
import { useParams } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const params = useParams();
  const campaignAddress = params.campaignAddress;
  const { signer } = useConnectWallet();
  const campaign = useCampaign(campaignAddress, signer);
  // console.log(campaign)
  const [hasParticipated, setHasParticipated] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [rewardPerReferral, setRewardPerReferral] = useState(0);
  const [estimatedReward, setEstimatedReward] = useState(0);
  const [userReferralCode, setUserReferralCode] = useState('');
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const address = signer?.address;
    try {
      // console.log(campaign)
      const participated = await campaign?.hasParticipated(address);
      // console.log(participated)
      setHasParticipated(participated);

      if (participated) {
        const count = await campaign?.referralCount(address);
        setReferralCount(Number(count));

        const reward = await campaign?.rewardPerReferral();
        setRewardPerReferral(ethers.formatEther(reward));

        const code = await campaign?.referralCodes(address);
        setUserReferralCode(code);

        setEstimatedReward(Number(count) * ethers.formatEther(reward));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  }, [campaign, signer]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleParticipate = async () => {
    try {
      setIsLoading(true);
      const tx = await campaign?.participate(inputReferralCode);
      await tx.wait();
      
      // Generate a random referral code
      const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Set the referral code
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const platformWallet = new ethers.Wallet(import.meta.env.VITE_PLATFORM_PRIVATE_KEY, provider);
      const platformSigner = campaign?.connect(platformWallet);
      
      const setCodeTx = await platformSigner?.setReferralCode(signer.address, newReferralCode);
      await setCodeTx.wait();

      setUserReferralCode(newReferralCode);
      setHasParticipated(true);
      fetchUserData();
    } catch (error) {
      console.error("Error participating in campaign:", error);
      alert("An error occurred while participating. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading-overlay">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-content fade-in">
        {!true ? (
          <div className="participation-section">
            <p className="info-text">You haven't participated in this campaign yet.</p>
            <input 
              className="input-field"
              type="text" 
              placeholder="Enter referral code (optional)" 
              value={inputReferralCode}
              onChange={(e) => setInputReferralCode(e.target.value)}
            />
            <button className="action-button" onClick={handleParticipate}>Participate in Campaign</button>
          </div>
        ) : (
          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-label">Your Referral Code:</span>
              <span className="stat-value highlight">{userReferralCode}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Number of Referrals:</span>
              <span className="stat-value">{referralCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reward Per Referral:</span>
              <span className="stat-value">{rewardPerReferral} Flip</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estimated Total Reward:</span>
              <span className="stat-value highlight">{estimatedReward} Flip</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;