<template>
  <AAView class="view-hotspots">
    <AAIdleHotspot />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import AAIdleHotspot from '@/components/hotspots/AAIdleHotspot.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AAIdleHotspot } })
export default class Hotspots extends Vue {}
</script>

<style lang="scss" scoped>
.view-hotspots {
  //
}
</style>
