// VerifiedUserPage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnectWallet, useCampaign } from "../utils/config";
import { useAuth } from '../contexts/AuthContext';
import { GET_SWAPS } from "../utils/queries";

const VerifiedUserPage = () => {
  const [swapId, setSwapId] = useState('');
  const [verifyClicked, setVerifyClicked] = useState(false);
  const { user, setUser } = useAuth();
  const params = useParams();
  const campaignAddress = params.campaignAddress;
  const { signer } = useConnectWallet();
  const campaign = useCampaign(campaignAddress, signer);
  const navigate = useNavigate();


  const { loading, error, data, refetch } = useQuery(GET_SWAPS, {
    context: { clientName: 'swap' },
  });
  console.log(data);

  const [campaignStartTime, setCampaignStartTime] = useState(null);

  useEffect(() => {
    const fetchCampaignStartTime = async () => {
      try {
        const startTime = await campaign?.creationTime();
        setCampaignStartTime(startTime);
      } catch (error) {
        console.error("Error fetching campaign start time:", error);
      }
    };
    fetchCampaignStartTime();
  }, [campaign]);

  const fetchTransactions = async (userAddress) => {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY; // Replace with your actual API key
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data.result;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  useEffect(() => {
    const verifySwap = async () => {
      if (verifyClicked && data && data.allSwaps && campaignStartTime && signer) {
        const userSwap = data.allSwaps.edges.find(edge => edge.node.nativeId === swapId)?.node;
        
        if (!userSwap) {
          alert("Swap not found. Please check the Swap ID and try again.");
          return;
        }

        console.log("Verification data:", { userSwap, campaignStartTime, signerAddress: signer.address });
        
        const depositAddress = userSwap.swapChannelByDepositChannelId?.depositAddress;
        const swapTimestamp = Math.floor(new Date(userSwap.swapScheduledBlockTimestamp).getTime() / 1000);
        console.log(swapTimestamp+"swapts")
        if (swapTimestamp >= campaignStartTime) {
          const transactions = await fetchTransactions(signer.address);
          console.log("Fetched transactions:", transactions);
          const hasValidTransaction = transactions.some(tx => 
            tx.to.toLowerCase() === depositAddress.toLowerCase() && 
            parseInt(tx.timeStamp) >= campaignStartTime
          );

          if (hasValidTransaction) {
            setUser({ ...user, hasSwapped: true });
            navigate(`/dashboard/${campaignAddress}`);
          } else {
            alert("No valid transaction found. Please make sure you've completed the swap.");
          }
        } else {
          alert("The swap was made before the campaign started. Please make a new swap.");
        }
      }
    };

    verifySwap();
  }, [data, campaignStartTime, signer, verifyClicked, user, navigate, campaignAddress, swapId]);

  const handleMakeSwap = () => {
    window.open('https://swap.chainflip.io/', '_blank');
  };

  const handleVerify = async () => {
    if (swapId) {
      console.log("Verifying swap with ID:", swapId);
      setVerifyClicked(true);
      try {
        await refetch();
      } catch (error) {
        console.error("Error during refetch:", error);
        alert(`Error verifying swap: ${error.message}`);
      }
    } else {
      alert("Please enter a Swap ID before verifying.");
    }
  };

  if (loading) return <p>Loading swaps...</p>;
  if (error) {
    console.error("Query Error:", error);
    return <p>Error: {error.message}</p>;
  }

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