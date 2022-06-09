<template>
  <div class="aa-sidebar" :safari="$store.state.safari">
    <router-link :to="{ name: 'home' }" class="logo">
      <div>Ligenium</div>
      <span>Track+</span>
    </router-link>

    <div class="items" v-if="$store.getters.user">
      <AASidebarItem route="account" title="Account" icon="account" />
      <AASidebarItem route="home" title="Übersicht" icon="home" />
      <AASidebarItem route="charts" title="Diagramme" icon="charts" />
      <AASidebarItem route="hotspots" title="Hotspots" icon="hotspots" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AASidebarItem from './AASidebarItem.vue';

@Component({
  components: {
    AASidebarItem,
  },
})
export default class AASidebar extends Vue {}
</script>

<style lang="scss" scoped>
.aa-sidebar {
  @media #{$isMobile} {
    transform: translateX(-100%);
  }
  transition: 0.2s ease-in-out;
  width: calc(#{$sidebar-width} + env(safe-area-inset-left));

  position: fixed;
  z-index: 1200;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid rgba(var(--vm-border), 1);

  background: rgba(var(--vm-paragraph), 1);
  background-image: linear-gradient(
      rgba(var(--vm-paragraph), 0.75),
      rgba(var(--vm-paragraph), 0.75)
    ),
    url('/assets/sidebar.webp');
  background-repeat: no-repeat;
  background-size: cover;

  overflow: auto;

  &:not([safari]) {
    @include aa-scrollbar();
  }

  .logo {
    height: 50px;
    z-index: 20;

    display: flex;
    align-items: center;
    text-decoration: none;
    padding-top: env(safe-area-inset-top);
    padding-left: calc(env(safe-area-inset-left) + 15px);
    position: sticky;
    top: 0;
    background: inherit;

    div {
      font-size: 1.2em;
      margin-left: 5px;
      font-weight: bold;
      color: rgba(var(--vm-primary), 1);
    }

    span {
      font-size: 0.85em;
      margin-left: 10px;
      padding: 2.5px 10px;
      border-radius: 100px;
      font-weight: 500;
      border: 1px solid currentColor;
      color: rgba(var(--vm-color-secondary), 1);
    }
  }

  .items {
    margin-top: 15px;
    padding-left: calc(env(safe-area-inset-left) + 15px);
    padding-right: 15px;
    display: grid;
    grid-gap: 10px;
    padding-bottom: 70px;
  }

  span[div] {
    font-size: 0.8em;
    font-weight: 500;
    text-transform: uppercase;
    color: rgba(var(--vm-color-secondary), 1);
  }
}
</style>
