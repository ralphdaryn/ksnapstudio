// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

function Auth0ProviderWithRedirect({ children }) {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience =
    process.env.REACT_APP_AUTH0_AUDIENCE || "https://rd-dashboard-api";

  const onRedirectCallback = (appState) => {
    const target = appState?.returnTo || "/dashboard";
    window.location.replace(`${window.location.origin}${target}`);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
        audience,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirect>
        <App />
      </Auth0ProviderWithRedirect>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();