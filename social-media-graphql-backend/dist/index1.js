// import { ApolloServer} from '@apollo/server';
// import {typeDefs} from './typedefs2';
// // import {schemaDirectives} from 'apollo-server'
// import resolvers from "./resolvers" 
// const { createToken, getUserFromToken } = require('./auth')
// import {db} from "./db/index"
// import { startStandaloneServer } from '@apollo/server/dist/esm/standalone';
// // const {FormatDateDirective, AuthenticationDirective, AuthorizationDirective} = require('./directives')
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   includeStacktraceInErrorResponses : false,
//   introspection : true
//   // schema: {
//   //   // log: LogDirective,
//   //   formatDate: FormatDateDirective,
//   //   authenticated: AuthenticationDirective,
//   //   authorized : AuthorizationDirective
//   // },
//   // subscriptions: {
//   //   onConnect(params) {
//   //     const token = params.authToken
//   //     const user = getUserFromToken(token)
//   //     // console.log({user})
//   //     if (!user) {
//   //       throw new Error('Authentication failed on subscriptions')
//   //     }
//   //     return { user }
//   //   }
//   // }
// })
//   // let app: any;
//   // (async () => {
//   //   app = await startStandaloneServer(server, {
//   //     context: async ({ req, res }) => {
//   //       const context = { ...db }
//   //       // if (connection) {
//   //       //   return { ...context, ...connection.context }
//   //       // }
//   //       const token = req.headers.authorization
//   //       const user = getUserFromToken(token)
//   //       return { ...context, user, createToken }
//   //     },
//   //     listen: { port: 4000 },
//   //   })
//   // })()
//   const { url } = await startStandaloneServer(server, {
//     context: async ({ req, res }) => {
//       const context = { ...db }
//       // if (connection) {
//       //   return { ...context, ...connection.context }
//       // }
//       const token = req.headers.authorization
//       const user = getUserFromToken(token)
//       return { ...context, user, createToken }
//     },
//     listen: { port: 4000 },
//   });
//   console.log(`🚀  Server ready at: ${url}`);
