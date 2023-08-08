import { ApolloServer } from "@apollo/server";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import allTypeDefs from "./typeDefs/index.typeDefs";
import allResolvers from "./resolvers/index.resolver";
import context from "./context";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
dotenv.config();
const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({
    typeDefs: allTypeDefs,
    resolvers: allResolvers,
});
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});
// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/',
});
// Hand in the schema we created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);
await server.start();
app.use("/", cors(), bodyParser.json(), expressMiddleware(server, {
    context: context,
}));
const mongoDB = process.env.MONGODB_URL;
const serverPort = process.env.PORT;
mongoose.set("strictQuery", true);
mongoose.connect(mongoDB).then(async () => {
    console.log("Connected to MongoDB..");
    const apolloExpressServer = await new Promise((resolve) => httpServer.listen({ port: serverPort }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/`);
    return apolloExpressServer;
});
