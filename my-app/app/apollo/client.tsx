import { ApolloClient, HttpLink, InMemoryCache, gql} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphql.eng.meridiancapital.com/graphql' }),
  cache: new InMemoryCache(),
});
export default client;