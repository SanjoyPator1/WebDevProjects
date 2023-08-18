import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/apolloClient.ts";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <GoogleOAuthProvider
            clientId={
              import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID
            }
          >
            <App />
          </GoogleOAuthProvider>
        </ApolloProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
