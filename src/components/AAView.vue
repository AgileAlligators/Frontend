<template>
  <div class="aa-view">
    <slot name="static" />
    <div v-if="$slots.header">
      <slot name="header" />
    </div>
    <div>
      <div class="body" :header="!!$slots.header" :footer="!!$slots.footer">
        <Table />
        <slot />
      </div>
    </div>
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Table from '@/components/Table.vue';

@Component({
  components: {
    Table,
  },
})
export default class AAView extends Vue {}
</script>

<style lang="scss" scoped>
.aa-view {
  display: grid;
  transition: 0.2s ease-in-out;

  .body {
    padding-top: calc(35px + 50px + env(safe-area-inset-top));
    padding-right: calc(5vw + env(safe-area-inset-right));
    padding-left: calc(5vw + env(safe-area-inset-left));
    padding-bottom: 35px;

    &[header] {
      padding-top: 35px;
    }

    max-width: $max-width;
    margin: 0 auto;
  }
}
</style>
