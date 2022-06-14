<template>
  <AAView class="view-hotspots">
    <AALoadHotspot />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import AALoadHotspot from '@/components/hotspots/AALoadHotspot.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AALoadHotspot } })
export default class Hotspots extends Vue {}
</script>

<style lang="scss" scoped>
.view-hotspots {
  //
}
</style>
