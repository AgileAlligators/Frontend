<template>
  <button
    class="aa-icon-button"
    @click="$emit('click', $event)"
    :href="href"
    :to="routeName ? { name: routeName } : undefined"
    :target="href ? '_blank' : undefined"
    :is="routeName ? 'router-link' : href ? 'a' : 'button'"
  >
    <slot>
      <component v-if="icon" :is="'ai-' + icon" />
      <span v-if="text">{{ text }}</span>
    </slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AAIconButton extends Vue {
  @Prop() icon!: string;
  @Prop() href!: string;
  @Prop() text!: string;
  @Prop() routeName!: string;
}
</script>

<style lang="scss" scoped>
.aa-icon-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 7.5px 0.95em;
  border-radius: 5px;
  border: none;
  color: rgba(var(--vm-color-secondary), 1);
  background: none;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  box-shadow: none;
  text-decoration: none;
  font-size: 16px;

  svg {
    height: 1em;
    width: 1em;
  }

  transition: 0.2s ease-in-out;

  &:not([disabled]) {
    &:hover {
      background: rgba(var(--vm-container), 1);
      color: rgba(var(--vm-color), 1);
    }
    &:active {
      transform: scale(0.9);
      filter: brightness(120%);
    }
  }

  &[disabled] {
    cursor: default;
    opacity: 0.33;
  }

  svg ~ span {
    margin-left: 0.5em;
  }

  span {
    white-space: nowrap;
    line-height: 1em;
  }

  &[active] {
    &,
    &:hover {
      color: rgba(var(--vm-primary), 1);
    }
  }
}
</style>
