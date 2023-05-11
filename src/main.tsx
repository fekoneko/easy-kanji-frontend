import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';
import { KanjiContextProvider } from './contexts/kanjiContext';
import { PopupContextProvider } from './contexts/popupContext';
import { SettingsContextProvider } from './contexts/settingsContext';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <SettingsContextProvider>
          <AuthContextProvider>
            <PopupContextProvider>
              <ModalContextProvider>
                <KanjiContextProvider>
                  <App />
                </KanjiContextProvider>
              </ModalContextProvider>
            </PopupContextProvider>
          </AuthContextProvider>
        </SettingsContextProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
