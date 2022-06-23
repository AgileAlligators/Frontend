<template>
  <div class="aa-time-range">
    <div class="wrapper">
      <div class="title">Zeitraum</div>
      <AATimeInput v-model="$store.state.time.start" />
      <div class="arrow">→</div>
      <AATimeInput v-model="$store.state.time.end" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AATimeInput from './forms/elements/AATimeInput.vue';

@Component({ components: { AATimeInput } })
export default class AATimeRange extends Vue {}
</script>

<style lang="scss" scoped>
.aa-time-range {
  position: sticky;
  top: calc(50px + env(safe-area-inset-top));
  background: rgba(var(--vm-background), 1);
  border-bottom: 1px solid rgba(var(--vm-border), 1);

  z-index: 20;

  .wrapper {
    padding-left: calc(5vw + env(safe-area-inset-left));
    padding-right: calc(5vw + env(safe-area-inset-right));
    height: 50px;

    @include aa-scrollbar();

    @media #{$isMobile} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right)
      );
    }
    @media #{$isDesktop} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right) - #{$sidebar-width}
      );
    }

    max-width: $max-width;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;

    .title {
      white-space: nowrap;
      font-weight: 550;

      border-right: 1px solid rgba(var(--vm-border), 1);
      color: rgba(var(--vm-color-secondary), 1);
      padding-right: 10px;
      margin-right: 10px;
    }

    .arrow {
      color: rgba(var(--vm-color-secondary), 1);
      padding: 0 10px;
    }
  }
}
</style>
