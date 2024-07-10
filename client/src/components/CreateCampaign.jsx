import { useState } from 'react'
import { ethers } from 'ethers'
import '../styles/CreateCampaign.css'

const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_ADDRESS

const CreateCampaign = ({ campaignFactory, signer }) => {
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [totalRewardAmount, setTotalRewardAmount] = useState('')
  const [rewardPerReferral, setRewardPerReferral] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const rewardToken = new ethers.Contract(
        REWARD_TOKEN_ADDRESS,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      )
      
      // Approve the CampaignFactory to spend tokens
      const approveTx = await rewardToken.approve(campaignFactory.target, ethers.parseEther(totalRewardAmount))
      await approveTx.wait()

      const tx = await campaignFactory.createCampaign(
        name,
        Math.floor(new Date(deadline).getTime() / 1000),
        ethers.parseEther(totalRewardAmount),
        ethers.parseEther(rewardPerReferral)
      )
      await tx.wait()
      console.log('Campaign created successfully')
      // Reset form
      setName('')
      setDeadline('')
      setTotalRewardAmount('')
      setRewardPerReferral('')
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  return (
    <div className="create-campaign-container">
      <h2>Create Campaign</h2>
      <form onSubmit={handleSubmit} className="create-campaign-form">
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="datetime-local"
          placeholder="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="number"
          placeholder="Total Reward Amount"
          value={totalRewardAmount}
          onChange={(e) => setTotalRewardAmount(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="number"
          placeholder="Reward Per Referral"
          value={rewardPerReferral}
          onChange={(e) => setRewardPerReferral(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="submit-button">Create Campaign</button>
      </form>
    </div>
  )
}

export default CreateCampaign
