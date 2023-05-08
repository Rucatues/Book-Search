const express = require('express');
// / Import the ApolloServer class, this is the library we will use to make it easier for our Node server to connect to our Apollo server. 
const { ApolloServer } = require('apollo-server-express');

// Import the two parts of a GraphQL schema- these are the schemas/controllers for Apollo and we are bringing them in so we can use them when starting our Apollo server
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  // first, instantiate the Apollo server, then start it
  // the entire express app actually sits inside of it as middleware
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server!
startApolloServer();