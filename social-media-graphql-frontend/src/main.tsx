import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/apolloClient.ts";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
