// UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useConnectWallet, useCampaign } from "../utils/config";
import { useParams } from 'react-router-dom';

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
    return <div>Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="dashboard-content fade-in">
          {!hasParticipated ? (
            <div>
              <p>You haven't participated in this campaign yet.</p>
              <input 
                className="input-field"
                type="text" 
                placeholder="Enter referral code (optional)" 
                value={inputReferralCode}
                onChange={(e) => setInputReferralCode(e.target.value)}
              />
              <button className="button" onClick={handleParticipate}>Participate in Campaign</button>
            </div>
          ) : (
            <div>
              <p><strong>Your Referral Code:</strong> {userReferralCode}</p>
              <p><strong>Number of Referrals:</strong> {referralCount}</p>
              <p><strong>Reward Per Referral:</strong> {rewardPerReferral} Flip</p>
              <p><strong>Estimated Total Reward:</strong> {estimatedReward} Flip</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;