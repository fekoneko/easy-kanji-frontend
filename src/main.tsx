import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';
import { KanjiContextProvider } from './contexts/kanjiContext';
import { ToastContextProvider } from './contexts/toastContext';
import { SettingsContextProvider } from './contexts/settingsContext';
import { HelmetProvider } from 'react-helmet-async';

import './styles/index.css';
import './i18n';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <SettingsContextProvider>
          <AuthContextProvider>
            <ToastContextProvider>
              <ModalContextProvider>
                <KanjiContextProvider>
                  <App />
                </KanjiContextProvider>
              </ModalContextProvider>
            </ToastContextProvider>
          </AuthContextProvider>
        </SettingsContextProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
