import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { GlobalContextProvider } from './contexts/globalContext';
import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <AuthContextProvider>
          <ModalContextProvider>
            <App />
          </ModalContextProvider>
        </AuthContextProvider>
      </GlobalContextProvider>
    </BrowserRouter>
  </StrictMode>
);
