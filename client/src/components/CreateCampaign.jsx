import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../styles/CreateCampaign.css';

const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_ADDRESS;

const CreateCampaign = ({ campaignFactory, signer, isWalletConnected }) => {
  const [name, setName] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('');
  const [totalRewardAmount, setTotalRewardAmount] = useState('');
  const [rewardPerReferral, setRewardPerReferral] = useState('');
  const [isCreating, setIsCreating] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isWalletConnected || !campaignFactory || !signer) {
      console.error("Wallet not connected or campaign factory not initialized");
      return;
    }
    setIsCreating(true);
    try {
      const rewardToken = new ethers.Contract(
        REWARD_TOKEN_ADDRESS,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      )

      await rewardToken.approve(campaignFactory,ethers.parseEther(totalRewardAmount))

      const deadlineSeconds = Math.floor(Date.now() / 1000) + (parseInt(deadlineDays) * 24 * 60 * 60);
      const tx = await campaignFactory.createCampaign(
        name,
        deadlineSeconds,
        ethers.parseEther(totalRewardAmount),
        ethers.parseEther(rewardPerReferral)
      );
      await tx.wait();
      console.log('Campaign created successfully');
      // Reset form
      setName('');
      setDeadlineDays('');
      setTotalRewardAmount('');
      setRewardPerReferral('');
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isWalletConnected) {
    return <p className="wallet-connect-message">Please connect your wallet to create a campaign.</p>;
  }

  return (
    <div className="create-campaign-container">
      <h2>Create Campaign</h2>
      <form onSubmit={handleSubmit} className="create-campaign-form">
        <div className="form-group">
          <label htmlFor="name">Campaign Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter campaign name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Campaign Duration (days)</label>
          <input
            type="number"
            id="deadline"
            className="form-input"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            required
            min="1"
            placeholder="Enter campaign duration in days"
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalReward">Total Reward Amount (FLIP)</label>
          <input
            type="number"
            id="totalReward"
            className="form-input"
            value={totalRewardAmount}
            onChange={(e) => setTotalRewardAmount(e.target.value)}
            required
            min="0"
            step="0.000000000000000001"
            placeholder="Enter total reward amount"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rewardPerReferral">Reward Per Referral (FLIP)</label>
          <input
            type="number"
            id="rewardPerReferral"
            className="form-input"
            value={rewardPerReferral}
            onChange={(e) => setRewardPerReferral(e.target.value)}
            required
            min="0"
            step="0.000000000000000001"
            placeholder="Enter reward per referral"
          />
        </div>
        <button type="submit" className="submit-button" disabled={isCreating}>
          {isCreating ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
