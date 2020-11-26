require("dotenv").config(); // Load all environment variable
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
var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // <-- REQUIRED backend setting
};

app.use(express.static("public"));
app.use(cors(corsOptions));
server.applyMiddleware({ app, cors: false });

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb connected");
  });

app.listen({ port: 9090 }, () => {
  console.log(`🚀 Server ready at http://localhost:9090`);
});
