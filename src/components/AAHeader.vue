<template>
  <vm-navbar class="aa-header" breakpoint="1000px">
    <template
      :is="mobile ? 'vm-flow' : 'template'"
      :slot="mobile ? 'default' : 'static'"
      :class="{ options: mobile }"
    >
      <vm-flow v-if="$store.getters.desktop">
        <FilterDialog
          v-if="filterDialog"
          @clicked="filterDialog = false"
          :filterDialog="filterDialog"
        />
        <AAIconButton @click="toggleFilter">
          <p class="icon-title">Filter</p>
          <aiFilter />
        </AAIconButton>
        <AAIconButton
          :key="$store.getters.dark"
          :icon="$store.getters.dark ? 'sun' : 'moon'"
          v-title="
            'Darkmode ' + ($store.getters.dark ? 'de' : '') + 'aktivieren'
          "
          @click="$store.commit('toggleDark')"
        />
      </vm-flow>
    </template>

    <template v-if="mobile">
      <vm-flow slot="title">
        <router-link class="home" :to="{ name: 'home' }"> Track+ </router-link>
        <div class="title">{{ title }}</div>
      </vm-flow>

      <template v-if="$store.getters.user">
        <vm-navbar-item routeName="account" title="Account" />
        <vm-navbar-item routeName="home" title="Übersicht" />
        <vm-navbar-item routeName="charts" title="Diagramme" />
      </template>
    </template>
  </vm-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';
import aiFilter from '@/icons/etc/aiFilter.vue';
import FilterDialog from '@/components/FilterDialog.vue';

@Component({ components: { AAIconButton, aiFilter, FilterDialog } })
export default class AAHeader extends Vue {
  filterDialog = false;

  get mobile(): boolean {
    return !this.$store.getters.desktop;
  }

  get title(): string {
    return this.$store.getters.title.split(' |')[0];
  }

  toggleFilter(): void {
    this.filterDialog = !this.filterDialog;
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

  .aa-icon-button.mobile-search {
    display: flex;
    flex: 1 1 0px;
    background: rgba(var(--vm-paragraph), 1);
  }
  .icon-title {
    padding: 0px 10px 0px 10px;
  }
}
</style>
