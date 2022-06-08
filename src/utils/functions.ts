import store from '@/store';
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

export function stringToSelectable(input: string): {
  id: string;
  title: string;
} {
  return { id: input, title: input };
}

// Reference:
// https://www.mongodb.com/docs/manual/reference/method/ObjectId/
export function convertId(mongoId: string): number[] {
  const timestamp = mongoId.slice(0, 8);
  const random = mongoId.slice(8, 20);
  const counter = mongoId.slice(20, 25);
  return [timestamp, random, counter].map((x) => parseInt(x, 16));
}

export function getCounter(mongoId: string): string {
  let counter = '' + (convertId(mongoId)[2] - 18838);
  // TODO: maybe improve if possible
  while (counter.length !== 3) counter = '0' + counter;
  return counter;
}

export function strippedFilter(): Record<string, string[]> {
  const filter: Record<string, string[]> = store.getters.filter;
  Object.entries(filter).forEach(([key, value]) => {
    if (value.length === 0) delete filter[key];
  });
  return filter;
}
