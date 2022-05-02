<template>
  <router-link
    class="aa-sidebar-item"
    :to="to || { name: route }"
    :is="noroute ? 'div' : 'router-link'"
    :exact="to && to.query"
    :title="title"
  >
    <div class="head">
      <div class="expander" @click.prevent="expanded = !expanded">
        <ai-chevron-right v-if="$slots.default" :expanded="expanded" />
      </div>
      <div class="icon" v-if="icon">
        <component :is="'ai-' + icon" />
        <component :is="'ai-' + icon + '-filled'" />
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <vm-revealer>
      <div @click.prevent v-if="$slots.default && expanded" class="children">
        <slot />
      </div>
    </vm-revealer>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component
export default class AASidebarItem extends Vue {
  @Prop() route!: string;
  @Prop() to!: RawLocation;
  @Prop() title!: string;
  @Prop() icon!: string;
  @Prop() noroute!: boolean;

  public expanded = false;
}
</script>

<style lang="scss" scoped>
.aa-sidebar-item {
  color: rgba(var(--vm-color), 1);
  text-decoration: none;

  &:not([exact]).router-link-active:not([href='/']) > .head,
  &.router-link-exact-active > .head,
  .head:hover {
    background: rgba(var(--vm-background), 0.75);
    box-shadow: none;
  }
  &:not([exact]).router-link-active:not([href='/']) > .head,
  &.router-link-exact-active > .head {
    .icon svg {
      &:first-child {
        display: none;
      }
      &:last-child {
        display: unset;
      }
    }
  }
  font-size: 0.9375em;

  .head {
    display: flex;
    align-items: center;
    padding: 0.5em 0;

    font-weight: 500;
    border-radius: #{$border-radius / 2};
    transition: 0.2s ease-out;

    .title {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .icon {
      color: rgba(var(--vm-primary), 1);
      display: grid;
      place-content: center;
      width: 1em;
      padding-right: 0.5em;
      position: relative;

      svg {
        position: absolute;
        width: inherit;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: 0.2s ease-in-out;

        &:first-child {
          display: unset;
        }
        &:last-child {
          display: none;
        }
      }
    }

    &:hover .expander svg {
      opacity: 1;
    }

    .expander {
      color: rgba(var(--vm-color-secondary), 1);
      display: grid;
      place-content: center;
      width: 0.6em;
      padding: 0.25em;

      svg {
        width: inherit;
        transition: 0.3s ease-in-out;
        &[expanded] {
          opacity: 1;
          transform: rotate(90deg);
        }
      }
    }
  }

  .children {
    display: grid;
    grid-gap: 0.25em;
    padding: 0.25em {
      right: 0;
    }
  }
}
</style>
