<template>
  <AAView class="view-hotspots">
    <AATimeRange slot="static" />

    <AALocationHotspot />
    <AAIdleHotspot />
    <AALoadHotspot />
    <AAVibrationHotspot />
  </AAView>
</template>

<script lang="ts">
import AATimeRange from '@/components/AATimerange.vue';
import AAView from '@/components/AAView.vue';
import AAIdleHotspot from '@/components/hotspots/AAIdleHotspot.vue';
import AALoadHotspot from '@/components/hotspots/AALoadHotspot.vue';
import AALocationHotspot from '@/components/hotspots/AALocationHotspot.vue';
import AAVibrationHotspot from '@/components/hotspots/AAVibrationHotspot.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    AAView,
    AATimeRange,
    AALocationHotspot,
    AAIdleHotspot,
    AALoadHotspot,
    AAVibrationHotspot,
  },
})
export default class Hotspots extends Vue {}
</script>

<style lang="scss" scoped>
.view-hotspots {
  //
}
</style>
