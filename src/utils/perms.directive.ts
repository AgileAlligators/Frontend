import store from '@/store';
import { DirectiveFunction, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { User } from './authenticator';

export const PermsDirective: DirectiveFunction = (
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode
) => {
  const user: User | null = store.getters.user;
  if (!user) {
    removeElement(el, vnode);
    return;
  }

  if (user.group === 'admin') return;

  const { value, modifiers } = binding;
  if (!value || value === null) return;

  const list = transformPermissions(Array.isArray(value) ? value : [value]);

  if (!show(user.permissions, list, modifiers.all)) {
    removeElement(el, vnode);
  }
};

function removeElement(el: HTMLElement, vnode: VNode): void {
  const comment = document.createComment(' ');
  Object.defineProperty(comment, 'setAttribute', { value: () => undefined });
  vnode.elm = comment;
  vnode.text = ' ';
  vnode.isComment = true;
  vnode.context = undefined;
  vnode.tag = undefined;
  if (vnode.data) vnode.data.directives = undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (vnode.componentInstance) (vnode.componentInstance as any).$el = comment;

  if (el.parentNode) el.parentNode.replaceChild(comment, el);
}

function show(
  userPermmissions: string[],
  requiredPermissions: string[],
  all = false
): boolean {
  const has = userPermmissions.map((h) => splitPerm(h));
  const requires = requiredPermissions.map((r) => splitPerm(r));

  return requires[all ? 'every' : 'some']((r) => {
    if (r[1] === '?') {
      return has.some((h) => h[0] === r[0]);
    }
    return has.some(
      (h) => (h[0] === r[0] && h[1] === r[1]) || (h[0] === r[0] && h[1] === '*')
    );
  });
}

function splitPerm(perm: string): [string, string] {
  const lastIndex = perm.lastIndexOf('.');
  return [perm.substring(0, lastIndex), perm.substring(lastIndex + 1)];
}

function transformPermissions(permissions: string[]): string[] {
  const mapped = permissions.map((p) => {
    return [p, p.split('.').slice(0, -1).join('.') + '.*'];
  });
  return [...new Set(mapped.flat())];
}
