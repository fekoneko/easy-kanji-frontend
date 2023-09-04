import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';
import { KanjisContextProvider } from './contexts/kanjisContext';
import { ToastContextProvider } from './contexts/toastContext';
import { SettingsContextProvider } from './contexts/settingsContext';
import { HelmetProvider } from 'react-helmet-async';
import AppLoading from './pages/AppLoading';

import './styles/index.css';
import './i18n';

const App = lazy(() => import('./App'));

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <SettingsContextProvider>
          <AuthContextProvider>
            <Suspense fallback={<AppLoading />}>
              <ToastContextProvider>
                <ModalContextProvider>
                  <KanjisContextProvider>
                    <App />
                  </KanjisContextProvider>
                </ModalContextProvider>
              </ToastContextProvider>
            </Suspense>
          </AuthContextProvider>
        </SettingsContextProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
