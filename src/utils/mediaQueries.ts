import store from '@/store';

export const mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');
export const mqDesktop = window.matchMedia('(min-width: 661px)');

export function registerMQ(): void {
  mqDarkmode.addEventListener('change', mediaListenerDarkmode);
  mqDesktop.addEventListener('change', mediaListenerDesktop);
  // setDark(mqDarkmode.matches);
  setDesktop(mqDesktop.matches);
}

export function unregisterMQ(): void {
  mqDarkmode.removeEventListener('change', mediaListenerDarkmode);
  mqDesktop.removeEventListener('change', mediaListenerDesktop);
}

function mediaListenerDarkmode(event: MediaQueryListEvent): void {
  setDark(event && event.matches);
}

function mediaListenerDesktop(event: MediaQueryListEvent): void {
  setDesktop(event && event.matches);
}

function setDark(dark: boolean): void {
  store.commit('toggleDark', dark);
}

function setDesktop(desktop: boolean): void {
  store.commit('desktop', desktop);
}
