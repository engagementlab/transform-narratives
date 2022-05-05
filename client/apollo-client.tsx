
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.APOLLO_CLIENT_GRAPHQL_URI || '/api/graphql',
    cache: new InMemoryCache(),
});

export default client;