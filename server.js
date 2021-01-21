require("dotenv").config(); // Load all environment variable
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { corsWithOptions } = require("./cors");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const app = express();

app.use(express.static("public"));
app.use(cors(corsWithOptions));
server.applyMiddleware({ app, cors: false });

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb connected");
  });

app.listen({ port: process.env.HOST_PORT }, () => {
  console.log(`🚀 Server ready at ${process.env.HOST_URL}`);
});
