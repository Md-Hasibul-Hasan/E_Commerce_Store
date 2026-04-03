import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import { myrouter } from './routers/router'

import { Provider } from "react-redux";
import { mystore } from "./redux/store";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "./components/ThemeProvider";

const ClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", ClientId);

createRoot(document.getElementById('root')).render(
  <Provider store={mystore}>
    <GoogleOAuthProvider clientId={ClientId}>
      <ThemeProvider>
        <RouterProvider router={myrouter} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </Provider>
)
