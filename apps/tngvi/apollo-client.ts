import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const apollo = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
});
const query = async (name: string, queryStr: string) => {
  const result = await apollo.query({
    query: gql`
            query 
            {
                ${queryStr}
            }
      `,
  });
  return result.data[name];
};
export default query;
