import 'react-toastify/dist/ReactToastify.css?asset';
import '@popperjs/core/dist/esm/index.js?asset';
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset';
import '@fortawesome/fontawesome-free/js/all.min.js?asset';
import 'react-confirm-alert/src/react-confirm-alert.css?asset';
import '@base/assets/icons.css?asset';
import '@base/assets/custom.css?asset';
import '@base/assets/js/app.js?asset';
import 'bootstrap-icons/font/bootstrap-icons.min.css?asset';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
            registration.unregister();
        }
    }).catch(error => {
        console.error('Erreur lors de la désinscription du service worker :', error);
    });
}