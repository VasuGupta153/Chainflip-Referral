// VerifiedUserPage.js
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

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

const VerifiedUserPage = ({ userAddress, campaignStartTime, onBack }) => {
  const [hasSwapped, setHasSwapped] = useState(false);
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_SWAPS, {
    context: { clientName: 'swap' }
  });
  console.log(data);

  useEffect(() => {
    if (data && data.allSwaps.edges.length > 0) {
      const hasValidSwap = data.allSwaps.edges.some(edge => {
        const swap = edge.node;
        const depositAddress = swap.swapChannelByDepositChannelId?.depositAddress;

        // If depositAddress is null, skip this swap
        if (depositAddress === null) {
          return false;
        }
        
        // Convert ISO 8601 to Unix timestamp (seconds)
        const swapTimestamp = Math.floor(new Date(swap.swapScheduledBlockTimestamp).getTime() / 1000);
        console.log("swapTimestamp: "+swapTimestamp)
        console.log("cpTimestamp: "+campaignStartTime)
        console.log("useradd: "+userAddress)
        console.log("depadd: "+depositAddress)



        // Check both conditions: timestamp and user address
        return swapTimestamp >= campaignStartTime &&
               depositAddress === userAddress;
      });
      setHasSwapped(hasValidSwap);
    }
  }, [data, campaignStartTime]);

  const handleMakeSwap = () => {
    window.location.href = 'https://your-swapping-website.com';
  };

  const handleAlreadyDone = async () => {
    await refetch();
    if (hasSwapped) {
      navigate('/user-dashboard');
    } else {
      alert('No valid swaps found after campaign start. Please make a swap first.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={onBack}>Back to Campaigns</button>
      <h1>Campaign Actions</h1>
      {!hasSwapped ? (
        <>
          <button onClick={handleMakeSwap}>Make Swap</button>
          <button onClick={handleAlreadyDone}>Already Done</button>
        </>
      ) : (
        <p>You have already completed the swap. Redirecting to dashboard...</p>
      )}
    </div>
  );
};

export default VerifiedUserPage;