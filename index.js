const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

// const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb connected");
  });

server.listen(9090, () => {
  console.log("Server is runing on http://localhost:9090");
});
