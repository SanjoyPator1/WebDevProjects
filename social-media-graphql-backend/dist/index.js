import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import typeDefs from "./typedefs";
import resolvers from "./resolvers";
import context from './context';
dotenv.config();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const mongoDB = process.env.MONGODB_URL;
const serverPort = process.env.PORT;
console.log({ mongoDB });
mongoose.set('strictQuery', true);
mongoose
    .connect(mongoDB)
    .then(() => {
    console.log('Connected to MongoDB..');
    return startStandaloneServer(server, {
        context: context,
        listen: { port: 4000 },
    });
})
    .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
});
