import store from '@/store';
import { backendUrl } from './backend';

export interface User {
  id: string;
  username: string;
  organisation: string;
  permissions: string[];
  group: string;
  exp: number;
}

export class Authenticator {
  private static extractUser(token: string): User {
    const base64Url = (token || 'A.B.C').split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private static async validate(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      fetch(backendUrl + 'account/valid', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            this.signIn(token);
            resolve(true);
            return;
          }
          this.signOut();
        })
        .catch(() => {
          this.signOut();
          resolve(false);
        });
    });
  }

  public static test(): void {
    const token = localStorage.getItem('alligator-token');
    if (token) this.validate(token);
  }

  public static signOut(): void {
    localStorage.removeItem('alligator-token');
    store.commit('signOut');
  }

  public static signIn(token: string): void {
    const user = this.extractUser(token);
    localStorage.setItem('alligator-token', token);
    store.commit('signIn', user);
  }
}
