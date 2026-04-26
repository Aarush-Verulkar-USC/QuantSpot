import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const wsUrl = apiUrl.replace(/^http/, "ws");

const httpLink = new HttpLink({
  uri: `${apiUrl}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${wsUrl}/graphql`,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
