<template>
  <button
    class="aa-icon-button"
    @click.stop.capture.prevent="$emit('click', $event)"
    :href="href"
    :to="routeName || to ? to || { name: routeName } : undefined"
    :target="href ? '_blank' : undefined"
    :is="routeName || to ? 'router-link' : href ? 'a' : 'button'"
    :remove="icon && icon === 'remove'"
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
  @Prop() to!: Location;
}
</script>

<style lang="scss" scoped>
.aa-icon-button {
  --edit: 0, 136, 255;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 7.5px 0.95em;
  border-radius: 5px;
  border: none;
  color: rgba(var(--vm-color-secondary), 1);
  &[remove] {
    color: rgba(var(--vm-error), 0.75);
  }

  &[selected] {
    background: rgba(var(--vm-paragraph), 1);
  }

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
    &[remove]:hover {
      color: rgba(var(--vm-error), 1);
      background: rgba(var(--vm-error), 0.25);
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
  }

  &[active] {
    &,
    &:hover {
      color: rgba(var(--vm-primary), 1);
    }
  }
}
</style>
