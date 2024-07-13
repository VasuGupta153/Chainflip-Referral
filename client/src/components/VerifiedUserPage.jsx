// VerifiedUserPage.js
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet, useCampaign } from "../utils/config"; // Import the useWallet hook
import UserDashboard from './UserDashboard';

const GET_SWAPS = gql`
  query {
    allSwaps(orderBy: ID_ASC, first: 500, filter: {
        id: { greaterThan: 10235 }
        }) {
        edges {
            node {
                id
                nativeId
                type
                swapScheduledBlockTimestamp

                swapChannelByDepositChannelId {
                    depositAddress
                }

                depositAmount
                depositValueUsd
                sourceAsset
                sourceChain

                egressAmount
                egressValueUsd
                destinationAsset
                destinationChain
                destinationAddress

                intermediateAmount
                intermediateValueUsd

                swapChannelByDepositChannelId {
                    swapChannelBeneficiariesByDepositChannelId {
                        nodes {
                            brokerCommissionRateBps
                            type
                            brokerByBrokerId {
                                accountByAccountId {
                                    idSs58
                                }
                            }
                        }
                    }
                    brokerByBrokerId {
                        accountByAccountId {
                            idSs58
                        }
                    }
                }
            }
        }
    }
}
`;

const VerifiedUserPage = ({ campaignAddress }) => {
  const signer = useConnectWallet();
  const campaign = useCampaign(campaignAddress, signer);
  const [hasSwapped, setHasSwapped] = useState(false);
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_SWAPS, {
    context: { clientName: 'swap' }
  });
  console.log(data);
  const userAddress = signer.address;
  const [campaignStartTime, setCampaignStartTime] = useState(null);

  useEffect(() => {
    const fetchCampaignStartTime = async () => {
      const startTime = await campaign.creationTime();
      setCampaignStartTime(startTime);
    };
    fetchCampaignStartTime();
  }, [campaign]);

  useEffect(() => {
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
        console.log("swapTimestamp: " + swapTimestamp);
        console.log("cpTimestamp: " + campaignStartTime);
        console.log("useradd: " + userAddress);
        console.log("depadd: " + depositAddress);

        // Check both conditions: timestamp and user address
        return swapTimestamp >= campaignStartTime && depositAddress === userAddress;
      });
      setHasSwapped(hasValidSwap);
    }
  }, [data, campaignStartTime]);

  const handleMakeSwap = () => {
    window.location.href = 'https://your-swapping-website.com';
  };

  const handleRefetch = () => {
    refetch();
  };

  const onBack = () => {
    navigate('/campaigns');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (hasSwapped) {
    return <UserDashboard campaign = {campaign} signer={signer}/>;
  }

  return (
    <div>
      <button onClick={onBack}>Back to Campaigns</button>
      <h1>Campaign Actions</h1>
      <p>You're required to make a swap for participating in this campaign</p>
      <>
        <button onClick={handleMakeSwap}>Make Swap</button>
        <button onClick={handleRefetch}>Already Done</button>
      </>
    </div>
  );
};

export default VerifiedUserPage;
