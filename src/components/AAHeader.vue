<template>
  <vm-navbar class="aa-header" breakpoint="1000px">
    <template
      :is="mobile ? 'vm-flow' : 'template'"
      :slot="mobile ? 'default' : 'static'"
      :class="{ options: mobile }"
    >
      <vm-flow v-if="$store.getters.desktop">
        <AAIconButton
          :icon="$store.getters.dark ? 'sun' : 'moon'"
          @click="$store.commit('toggleDark')"
        />
      </vm-flow>
    </template>

    <template v-if="mobile">
      <vm-flow slot="title">
        <router-link class="home" :to="{ name: 'home' }">
          <ai-alligator />
        </router-link>
        <div class="title">{{ title }}</div>
      </vm-flow>

      <vm-navbar-item routeName="home" title="Home" />
      <vm-navbar-item routeName="about" title="Über" />
    </template>
  </vm-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';

@Component({ components: { AAIconButton } })
export default class AAHeader extends Vue {
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
    display: grid;
    place-content: center;
    width: 50px;
    height: 50px;
    color: inherit;
    svg {
      width: 30px;
    }
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
}
</style>
