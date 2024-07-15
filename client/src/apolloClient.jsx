import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Link for campaign data
const campaignLink = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/82375/flipgraph2/1',
});

// Link for swap data (replace with your actual swap data endpoint)
const swapLink = new HttpLink({
  uri: 'https://processor-perseverance.chainflip.io/graphql',
});

const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'swap',
    swapLink,
    campaignLink
  ),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          campaignCreateds: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          allSwaps: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;