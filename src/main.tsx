import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    let updateNotified = false;
    const notifyUpdateAvailable = () => {
      if (updateNotified) return;
      updateNotified = true;
      window.dispatchEvent(new Event('solotodo:update-available'));
    };

    navigator.serviceWorker.addEventListener('controllerchange', notifyUpdateAvailable);

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.update();

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update();
        });

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUpdateAvailable();
            }
          });
        });

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          notifyUpdateAvailable();
        }
      })
      .catch((error) => {
        console.warn('Service Worker konnte nicht registriert werden.', error);
      });
  });
}
