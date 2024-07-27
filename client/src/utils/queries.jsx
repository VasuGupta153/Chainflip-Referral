import { gql } from '@apollo/client';


export const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      name
      rewardPerReferral
      isLive
      campaignAddress
    }
  }
`;

export const GET_SWAPS = gql`
  query {
    allSwaps(orderBy: ID_ASC, filter: {
        id: { greaterThan: 1150 }
        }) {
        edges {
            node {
                id
                nativeId
                swapScheduledBlockTimestamp
                swapChannelByDepositChannelId {
                    depositAddress
                }
            }
        }
    }
}
`;