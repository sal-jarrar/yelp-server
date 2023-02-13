import * as dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers/index.js";
import express from "express";
import cors from "cors";
import path from "path";
const app = express();

const PORT = process.env.PORT || 5002;

app.use(cors());

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => req,
  cache: process.env.NODE_ENV === "production" && "bounded",
});

app.listen(PORT, () => {
  server.listen().then(({ url }) => console.log(`SERVER RUNNIG AT: ${url}`));
});
