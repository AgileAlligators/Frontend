import { suffix } from '@/router';
import store from '@/store';

export class MetaInjector {
  static setPageTitle(title?: string): void {
    if (!title) return;

    title += suffix;
    document.title = title;

    store.commit('title', title);

    const gt = document.querySelector('meta[name="title"]');
    if (gt) gt.setAttribute('content', title);

    const twitter = document.querySelector('meta[property="twitter:title"]');
    if (twitter) twitter.setAttribute('content', title);

    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', title);
  }

  static setPageDescription(description?: string): void {
    if (!description) return;

    const gt = document.querySelector('meta[name="description"]');
    if (gt) gt.setAttribute('content', description);

    const twitter = document.querySelector(
      'meta[property="twitter:description"]'
    );
    if (twitter) twitter.setAttribute('content', description);

    const og = document.querySelector('meta[property="og:description"]');
    if (og) og.setAttribute('content', description);
  }
}
