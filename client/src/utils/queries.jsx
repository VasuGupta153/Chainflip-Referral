import { gql } from '@apollo/client';


export const GET_ACTIVE_CAMPAIGNS = gql`
  query {
    campaignCreateds(where: { isLive: "1" }) {
      id
      creator
      isLive
      campaignAddress
    }
  }
`;


export const GET_SWAP_BY_ID = gql`
query GetSwapById($swapId: String!) {
  swapById(id: $swapId) {
    id
    swapChannelByDepositChannelId {
      depositAddress
    }
    swapScheduledBlockTimestamp
  }
}
`;
