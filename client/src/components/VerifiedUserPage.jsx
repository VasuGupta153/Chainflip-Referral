import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnectWallet, useCampaign } from "../utils/config";
import { useAuth } from '../contexts/AuthContext';
import { GET_SWAPS } from "../utils/queries";
import '../styles/VerifiedUserPage.css';

const VerifiedUserPage = () => {
  const [swapId, setSwapId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
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

  const fetchTransaction = async (txHash) => {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
    const url = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
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
          const transaction = await fetchTransaction(transactionHash);
          console.log("Fetched transaction:", transaction);
          
          if (transaction && 
              transaction.to.toLowerCase() === depositAddress.toLowerCase() && 
              parseInt(transaction.timeStamp) >= campaignStartTime) {
            setUser({ ...user, hasSwapped: true });
            navigate(`/dashboard/${campaignAddress}`);
          } else {
            alert("Invalid transaction. Please make sure you've entered the correct transaction hash for your swap.");
          }
        } else {
          alert("The swap was made before the campaign started. Please make a new swap.");
        }
      }
    };

    verifySwap();
  }, [data, campaignStartTime, signer, verifyClicked, user, navigate, campaignAddress, swapId, transactionHash]);

  const handleMakeSwap = () => {
    window.open('https://swap.chainflip.io/', '_blank');
  };

  const handleVerify = async () => {
    if (swapId && transactionHash) {
      console.log("Verifying swap with ID:", swapId, "and Transaction Hash:", transactionHash);
      setVerifyClicked(true);
      try {
        await refetch();
      } catch (error) {
        console.error("Error during refetch:", error);
        alert(`Error verifying swap: ${error.message}`);
      }
    } else {
      alert("Please enter both Swap ID and Transaction Hash before verifying.");
    }
  };

  if (loading) return <p>Loading swaps...</p>;
  if (error) {
    console.error("Query Error:", error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="verified-user-page">
      <h1 className="page-title">Campaign Actions</h1>
      <p className="instruction">You're required to make a swap for participating in this campaign</p>
      <div className="input-container">
        <input
          type="text"
          value={swapId}
          onChange={(e) => setSwapId(e.target.value)}
          placeholder="Enter your Swap ID"
          className="input-field"
        />
        <input
          type="text"
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
          placeholder="Enter your Transaction Hash"
          className="input-field"
        />
      </div>
      <div className="button-container">
        <button onClick={handleVerify} className="action-button verify-button">Verify Swap</button>
        <button onClick={handleMakeSwap} className="action-button make-swap-button">Make Swap</button>
      </div>
      {loading && <p className="loading-message">Loading swaps...</p>}
      {error && <p className="error-message">Error: {error.message}</p>}
    </div>
  );
};


export default VerifiedUserPage;