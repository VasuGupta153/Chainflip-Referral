// VerifiedUserPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnectWallet, useCampaign } from "../utils/config";
import { useAuth } from '../contexts/AuthContext';


const VerifiedUserPage = () => {
  const [swapId, setSwapId] = useState('');
  const { user, setUser } = useAuth();
  const params = useParams();
  const campaignAddress = params.campaignAddress;
  const { signer } = useConnectWallet();
  const campaign = useCampaign(campaignAddress, signer);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_SWAP_BY_ID, {
    variables: { swapId },
    skip: !swapId,
    context: { clientName: 'swap' }
  });

  const [campaignStartTime, setCampaignStartTime] = useState(null);

  useEffect(() => {
    const fetchCampaignStartTime = async () => {
      const startTime = await campaign?.creationTime();
      setCampaignStartTime(startTime);
    };
    fetchCampaignStartTime();
  }, [campaign]);

  const fetchTransactions = async (userAddress) => {
    const apiKey = 'YourApiKeyToken'; // Replace with your actual API key
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  };

  useEffect(() => {
    const verifySwap = async () => {
      if (data && data.swapById && campaignStartTime && signer) {
        const swap = data.swapById;
        const depositAddress = swap.swapChannelByDepositChannelId?.depositAddress;
        const swapTimestamp = Math.floor(new Date(swap.swapScheduledBlockTimestamp).getTime() / 1000);

        if (swapTimestamp >= campaignStartTime) {
          const transactions = await fetchTransactions(signer.address);
          const hasValidTransaction = transactions.some(tx => 
            tx.to.toLowerCase() === depositAddress.toLowerCase() && 
            parseInt(tx.timeStamp) >= campaignStartTime
          );

          if (hasValidTransaction) {
            setUser({ ...user, hasSwapped: true });
            navigate(`/dashboard/${campaignAddress}`);
          }
        }
      }
    };

    verifySwap();
  }, [data, campaignStartTime, signer, swapId]);

  const handleMakeSwap = () => {
    window.open('https://swap.chainflip.io/', '_blank');
  };

  const handleVerify = () => {
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Campaign Actions</h1>
      <p>You're required to make a swap for participating in this campaign</p>
      <input
        type="text"
        value={swapId}
        onChange={(e) => setSwapId(e.target.value)}
        placeholder="Enter your Swap ID"
      />
      <button onClick={handleVerify}>Verify Swap</button>
      <button onClick={handleMakeSwap}>Make Swap</button>
    </div>
  );
};

export default VerifiedUserPage;