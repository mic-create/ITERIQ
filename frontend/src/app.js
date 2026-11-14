import { initGlobalStyles } from './styles.js';
import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalStyles();
    Router.init();
});