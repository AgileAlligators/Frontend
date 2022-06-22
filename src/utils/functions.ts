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
  return ('00000000' + (convertId(mongoId)[2] - 4803)).slice(-3);
}

export function strippedFilter(): Record<string, string[]> {
  const filter: Record<string, string[]> = store.getters.filter;
  const ids: string[] | undefined = store.getters.selection;
  Object.entries(filter).forEach(([key, value]) => {
    if (value.length === 0) delete filter[key];
  });
  if (ids) filter.ids = ids;
  return filter;
}

export function date(timestamp: number): string {
  const dtf = Intl.DateTimeFormat('de-de', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  try {
    return dtf.format(timestamp);
  } catch (error) {
    return dtf.format(Date.now());
  }
}

export function time(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  let x: (string | number)[] = [];
  if (mins > 0 || hours === 0)
    x = [mins, mins === 1 ? 'Minute' : 'Minuten', ...x];
  if (hours > 0) x = [hours, hours === 1 ? 'Stunde' : 'Stunden', ...x];
  return x.join(' ');
}

export function carrierColor(id: string | number): string {
  if (typeof id === 'string') id = id.length === 3 ? +id : +getCounter(id);
  return [
    '#F79F1F',
    '#A3CB38',
    '#1289A7',
    '#D980FA',
    '#B53471',
    '#EE5A24',
    '#009432',
    '#0652DD',
    '#9980FA',
    '#833471',
  ][id % 10];
}

export function toPercent(val: number): number {
  return Math.round(val * 10000) / 100;
}
