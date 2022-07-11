import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const apollo = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
});
const query = async (name: string, queryStr: string) => {
  try {
    const result = await apollo.query({
      query: gql`
            query 
            {
                ${queryStr}
            }
      `,
    });
    return result.data[name];
  } catch (err) {
    if (err.networkError) console.error(err.networkError.result);
    else console.error(err);
  }
};
export default query;
