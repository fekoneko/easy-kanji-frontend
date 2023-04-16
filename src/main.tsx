import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalContextProvider } from './contexts/globalContext';
import './styles/index.css';
import { AuthContextProvider } from './contexts/authContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </GlobalContextProvider>
    </BrowserRouter>
  </StrictMode>
);
