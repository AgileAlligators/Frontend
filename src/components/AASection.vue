<template>
  <div class="aa-section">
    <hr />
    <div class="aa-section-head" v-if="title || subtitle || $slots.title">
      <div>
        <div class="aa-section-title" v-if="title" v-text="title" />
        <div class="aa-section-subtitle" v-if="subtitle" v-text="subtitle" />
      </div>
      <div class="aa-section-head-slot" v-if="$slots.title">
        <slot name="title" />
      </div>
    </div>
    <div class="aa-section-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AASection extends Vue {
  @Prop() title!: string;
  @Prop() subtitle!: string;
}
</script>

<style lang="scss">
.aa-section[share] .aa-section-content .aa-icon-button {
  font-size: 20px;
  &:hover {
    background: rgba(var(--vm-background), 1);
  }
}
.aa-section[section] .aa-section-content {
  background: rgba(var(--vm-background), 1);
  padding: 0 30px 20px;
  border-radius: $border-radius;
}
</style>

<style lang="scss" scoped>
.aa-section {
  hr {
    display: none;
  }

  & + .aa-section,
  &[line] {
    &:not([noline]) {
      hr {
        margin: $spacer 0 0;
        display: block;
      }
    }
  }

  &-head {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 8px 0;
  }

  &-title {
    padding-top: 3.75px;
    font-size: 1.3rem;
    font-weight: 550;
  }

  &-subtitle {
    font-size: 1.1rem;
    color: rgba(var(--vm-color-secondary), 1);
  }

  &-head-slot {
    margin-left: 10px;
    a {
      padding-top: 3.75px;
    }
  }

  &-content {
    margin-top: 10px;
  }

  &-title,
  &-subtitle,
  &-head-slot {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
