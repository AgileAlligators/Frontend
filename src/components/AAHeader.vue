<template>
  <vm-navbar class="aa-header" breakpoint="1000px">
    <vm-flow slot="static" v-if="!mobile">
      <AAIconButton
        :key="$store.getters.dark"
        :icon="$store.getters.dark ? 'sun' : 'moon'"
        v-title="'Darkmode ' + ($store.getters.dark ? 'de' : '') + 'aktivieren'"
        @click="$store.commit('toggleDark')"
      />
    </vm-flow>

    <template v-if="mobile">
      <vm-flow slot="title">
        <router-link class="home" :to="{ name: 'home' }"> Track+ </router-link>
        <div class="title">{{ title }}</div>
      </vm-flow>

      <div>
        <vm-list-item
          title="Darkmode"
          @click="$store.commit('toggleDark')"
          :key="$store.getters.dark"
        >
          <vm-switch
            slot="action"
            :value="$store.getters.dark"
            @input="
              $event !== $store.getters.dark && $store.commit('toggleDark')
            "
          />
        </vm-list-item>
      </div>

      <template v-if="$store.getters.user">
        <vm-navbar-item routeName="account" title="Account" />
        <vm-navbar-item routeName="home" title="Übersicht" />
        <vm-navbar-item routeName="charts" title="Diagramme" />
        <vm-navbar-item routeName="hotspots" title="Hotspots" />
        <vm-navbar-item routeName="peaks" title="Spitzen" />
        <vm-navbar-item routeName="guide" title="Handbuch" />
      </template>
    </template>
  </vm-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';

@Component({ components: { AAIconButton } })
export default class AAHeader extends Vue {
  filterDialog = false;

  get mobile(): boolean {
    return !this.$store.getters.desktop;
  }

  get title(): string {
    return this.$store.getters.title.split(' |')[0];
  }
}
</script>

<style lang="scss">
.vm-navbar {
  @media #{$isDesktop} {
    left: calc(#{$sidebar-width} + env(safe-area-inset-left)) !important;
  }
  &--container {
    max-width: $max-width;
    margin: 0 auto;
  }
}
</style>

<style lang="scss" scoped>
.aa-header {
  .home {
    font-size: 0.85em;
    padding: 2.5px 10px;
    border-radius: 100px;
    font-weight: 500;
    border: 1px solid currentColor;
    color: rgba(var(--vm-color-secondary), 1);
    text-decoration: none;
  }

  .title {
    font-weight: 550;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(90vw - 140px);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  @media #{$isDesktop} {
    .aa-icon-button {
      margin-left: 5px;
    }
  }

  @media #{$isMobile} {
    .vm-flow.options {
      .vm-flow {
        width: 100%;
        padding: 10px 0;
        border-bottom: 1px solid rgba(var(--vm-border), 1);
      }
    }
  }

  .vm-flow.options {
    margin-bottom: 5px;
  }
}
</style>
