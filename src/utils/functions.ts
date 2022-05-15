import Vue from 'vue';
import { VMNotificationObject } from 'vuement';

export function copyToClipboard(text: string): void {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

export function join(array: (string | number)[]): string {
  return array
    .map((x, i) => {
      if (i === 0) return x;
      if (i !== array.length - 1) return ', ' + x;
      return ' & ' + x;
    })
    .join('');
}

export function sendNotification(notification: VMNotificationObject): void {
  Vue.prototype.$vm.sendNotification(notification);
}

export function capitalize(s: string | null): string | null {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
