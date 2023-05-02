import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';
import { KanjiContextProvider } from './contexts/kanjiContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ModalContextProvider>
          <KanjiContextProvider>
            <App />
          </KanjiContextProvider>
        </ModalContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
