import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const apollo = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
});
const query = async (queryStr: string) => {
  await apollo.query({
    query: gql`
            query 
            
            }
      `,
  });
};
export default apollo;
