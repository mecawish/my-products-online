import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";
import ActionCable from "actioncable";
import { ActionCableLink } from "graphql-ruby-client";

const httpLink = createHttpLink({
  uri: "https://staging-api.sayduck.io/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cable = ActionCable.createConsumer("wss://staging-api.sayduck.io/cable");

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) =>
      kind === "OperationDefinition" && operation === "subscription"
  );
};

const link = split(
  hasSubscriptionOperation,
  new ActionCableLink({ cable }),
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

export default client;
