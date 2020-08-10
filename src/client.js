import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://staging-api.sayduck.io/graphql",
  cache: new InMemoryCache(),
});

export default client;
