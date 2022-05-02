<template>
  <vm-dialog
    class="aa-update-available"
    :value="innerValue"
    @close="close"
    title="Update verfügbar"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />
    <div class="about">
      Update Agile Alligators, um die neuesten Funktionen zu nutzen.
    </div>

    <template slot="footer">
      <vm-dialog-button color="color" title="Abbrechen" @click="close" />
      <vm-dialog-button title="Updaten" @click="$emit('refresh')" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class AAUpdateAvailable extends Vue {
  @Prop() value!: boolean;

  public innerValue = !!this.value;

  @Watch('value')
  valueChanged(): void {
    this.innerValue = !!this.value;
  }

  public close(): void {
    this.innerValue = false;
    this.$emit('input', false);
  }
}
</script>

<style lang="scss">
.aa-update-available .vm-dialog {
  max-width: 370px;
}
</style>

<style lang="scss" scoped>
.aa-update-available {
  .about {
    padding-top: 0.5em;
    font-size: 1.1em;
    color: rgba(var(--vm-color-secondary), 1);
    white-space: pre-line;
  }
}
</style>
