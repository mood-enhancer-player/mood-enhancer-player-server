const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const app = express();
server.applyMiddleware({ app });

app.use(express.static("public"));
app.use(cors());

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb connected");
  });

app.listen({ port: 9090 }, () => {
  console.log(`🚀 Server ready at http://localhost:9090`);
});
