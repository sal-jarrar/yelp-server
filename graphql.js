require("dotenv").config();
const { ApolloServer } = require("apollo-server-lambda");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const typeDefs = require("./schema/type-defs");
const resolvers = require("./schema/resolvers");
const express = require("express");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  introspection: process.env.NODE_ENV !== "production",
  context: ({ event, context, express }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req,
  }),
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

// server.listen().then(({ url }) => console.log(`SERVER RUNNIG AT: ${url}`));
