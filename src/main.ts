// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

function updateFavicon() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = isDark ? '/favicon-dark.ico' : '/favicon-light.ico';
  }
}

// Initial setup
updateFavicon();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);