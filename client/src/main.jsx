import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './index.css'
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.js';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);