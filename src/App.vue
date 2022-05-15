<template>
  <div class="agile-alligators" id="app">
    <AASidebar />
    <AAHeader />

    <vm-notification />
    <AARouter />

    <AAUpdateAvailable v-model="updateAvailable" @refresh="refresh" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { registerMQ, unregisterMQ } from '@/utils/mediaQueries';

import AARouter from '@/components/AARouter.vue';
import AAUpdateAvailable from './components/dialogs/AAUpdateAvailable.vue';
import AASidebar from './components/sidebar/AASidebar.vue';
import AAHeader from './components/AAHeader.vue';

@Component({
  components: {
    AAUpdateAvailable,
    AARouter,
    AASidebar,
    AAHeader,
  },
})
export default class App extends Vue {
  public registration: ServiceWorkerRegistration | null = null;
  public updateAvailable = false;
  public refreshing = false;

  created(): void {
    document.addEventListener(
      'serviceWorkerUpdateEvent',
      (e) => {
        const reg = e as CustomEvent<ServiceWorkerRegistration>;
        this.registration = reg.detail;
        this.updateAvailable = true;
      },
      { once: true }
    );

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  }

  mounted(): void {
    registerMQ();
  }

  beforeDestroy(): void {
    unregisterMQ();
  }

  public refresh(): void {
    this.updateAvailable = false;
    if (this.registration) {
      this.registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
    'Timos Design', 'Helvetica Neue', 'Segoe UI', Roboto, Arial, 'noto sans',
    'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji',
    sans-serif;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  background: rgba(var(--vm-paragraph), 1) !important;
}

body {
  min-height: 100vh;
  margin: 0;
}

* {
  -webkit-overflow-scrolling: touch;
}

[content] {
  padding-top: calc(35px + 50px + env(safe-area-inset-top));
  padding-right: calc(5vw + env(safe-area-inset-right));
  padding-left: calc(5vw + env(safe-area-inset-left));
  padding-bottom: 35px;

  transition: 0.2s ease-in-out;
  max-width: $max-width;
  min-height: 100vh;
  margin: 0 auto;
}

[cursor] {
  cursor: pointer;
}

[center] {
  text-align: center;
}

[highlight] {
  color: rgba(var(--vm-primary), 1) !important;
}

[no-td] {
  text-decoration: none;
}

a {
  text-decoration: none;
  color: rgba(var(--vm-primary), 1);
  &:hover {
    text-decoration: underline;
  }
}

hr {
  border: none;
  background: rgba(var(--vm-border), 1);
  height: 1px;
  border-radius: 5px;
}

a.icon-link {
  display: flex;
  width: fit-content;
  align-items: center;
  white-space: nowrap;
  flex-wrap: nowrap;
  svg {
    margin-left: 0.2em;
    height: 0.7em;
  }

  text-decoration: none;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    background: currentColor;
    height: 0.07em;
    border-radius: 0.1em;
    bottom: -0.1em;
    transition: 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  &::after {
    right: 0;
    width: 0;
  }

  &:hover::after {
    width: calc(100% - 0.9em);
    transform: translateX(-0.9em);
  }
}

.form-input-title {
  color: rgba(var(--vm-color-secondary), 1);
  padding: 5px 5px 0;
  font-size: 0.8em;
  font-weight: 500;

  span {
    position: relative;
    &::before {
      position: absolute;
      content: '(optional)';
      font-weight: bold;
      transform: scale(0.8);
      color: rgba(var(--vm-color-secondary), 0.75);
    }
  }
}

.bar-appear-enter {
  margin-top: -50px;
}
.bar-disappear {
  margin-top: -50px;
  transition: cubic-bezier(0.55, 0, 0.1, 1) 0.3s;
}
.bar-appear-enter-active {
  transition: 0.75s cubic-bezier(0.55, 0, 0.1, 1);
}

form[dialog] {
  display: flex;
  flex-direction: column;
}

.aa-tooltip {
  border: 1px solid rgba(var(--vm-border), 1);
  font-weight: 500;

  &[position='bottom'] .aa-tooltip-arrow {
    border-bottom-color: rgba(var(--vm-border), 1) !important;
  }
  &[position='top'] .aa-tooltip-arrow {
    border-top-color: rgba(var(--vm-border), 1) !important;
  }
  &[position='left'] .aa-tooltip-arrow {
    border-left-color: rgba(var(--vm-border), 1) !important;
  }
  &[position='right'] .aa-tooltip-arrow {
    border-right-color: rgba(var(--vm-border), 1) !important;
  }
}
</style>
