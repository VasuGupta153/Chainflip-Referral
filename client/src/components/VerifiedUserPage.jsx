// VerifiedUserPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnectWallet, useCampaign } from "../utils/config"; // Import the useWallet hook
import { GET_SWAPS } from '../utils/queries';
import { useAuth } from '../contexts/AuthContext';

const VerifiedUserPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_SWAPS, {
    context: { clientName: 'swap' }
  });
  const { user, setUser } = useAuth();
  // console.log(data);
  const params = useParams();
  const campaignAddress = params.campaignAddress;
  const { signer } = useConnectWallet();
  // console.log(signer);
  const campaign = useCampaign(campaignAddress, signer);
  // console.log(campaign)
  const navigate = useNavigate();

  const [campaignStartTime, setCampaignStartTime] = useState(null);
  useEffect(() => {
    const fetchCampaignStartTime = async () => {
      const startTime = await campaign?.creationTime();
      // console.log(startTime);
      setCampaignStartTime(startTime);
    };
    fetchCampaignStartTime();
  }, [campaign]);

  useEffect(() => {
    const userAddress = signer?.address;
    if (data && data.allSwaps.edges.length > 0 && campaignStartTime) {
      const hasValidSwap = data.allSwaps.edges.some(edge => {
        const swap = edge.node;
        const depositAddress = swap.swapChannelByDepositChannelId?.depositAddress;

        // If depositAddress is null, skip this swap
        if (depositAddress === null) {
          return false;
        }

        // Convert ISO 8601 to Unix timestamp (seconds)
        const swapTimestamp = Math.floor(new Date(swap.swapScheduledBlockTimestamp).getTime() / 1000);
        // console.log("swapTimestamp: " + swapTimestamp);
        // console.log("cpTimestamp: " + campaignStartTime);
        // console.log("useradd: " + userAddress);
        // console.log("depadd: " + depositAddress);

        // Check both conditions: timestamp and user address
        return swapTimestamp >= campaignStartTime && depositAddress === userAddress;
      });
      if (hasValidSwap) {
        setUser({ ...user, hasSwapped: true });
        navigate(`/dashboard/${campaignAddress}`);
      }
    }
  }, [data, campaignStartTime, signer]);

  const handleMakeSwap = () => {
    window.open('https://swap.chainflip.io/', '_blank');
  };

  const handleRefetch = () => {
    setUser({ ...user, hasSwapped: true });
    navigate(`/dashboard/${campaignAddress}`);
    // refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Campaign Actions</h1>
      <p>You're required to make a swap for participating in this campaign</p>
      <>
        <button onClick={handleMakeSwap}>Make Swap</button>
        <button onClick={handleRefetch}>Already Done!</button>
      </>
    </div>
  );
};

export default VerifiedUserPage;
