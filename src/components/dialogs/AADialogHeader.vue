<template>
  <div class="aa-dialog-header">
    <div class="title" :onlyTitle="!(about || $slots.default)">
      <i :is="'ai-' + icon" v-if="icon" />
      {{ title }}
    </div>
    <div class="about" v-if="about || $slots.default">
      <slot>{{ about }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AADialogHeader extends Vue {
  @Prop() icon!: string;
  @Prop() title!: string;
  @Prop() about!: string;
}
</script>

<style lang="scss" scoped>
.aa-dialog-header {
  background: rgba(var(--vm-color), 0.05);
  padding: 20px;
  margin: -20px;

  border-radius: 15px 15px 0 0;

  padding-bottom: 10px;
  margin-bottom: 10px;

  .title {
    font-size: 1.6em;
    font-weight: 550;

    &[onlyTitle] {
      margin-bottom: 10px;
    }

    display: flex;
    align-items: center;

    svg {
      color: inherit;
      height: 1em;
      margin-right: 0.25em;
    }
  }

  .about {
    margin-top: 0.5em;
    margin-bottom: 10px;
    font-size: 1.1em;
    color: rgba(var(--vm-color-secondary), 1);
    white-space: pre-line;
  }
}
</style>
