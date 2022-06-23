<template>
  <AAView class="view-charts">
    <AATimeRange slot="static" />

    <AALoadChart />
    <AAIdleChart />
    <AAVibrationChart />
  </AAView>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import AAView from '@/components/AAView.vue';
import AALoadChart from '@/components/charts/AALoadChart.vue';
import AAIdleChart from '@/components/charts/AAIdleChart.vue';
import AAVibrationChart from '@/components/charts/AAVibrationChart.vue';
import AATimeRange from '@/components/AATimerange.vue';

@Component({
  components: {
    AAView,
    AATimeRange,
    AALoadChart,
    AAIdleChart,
    AAVibrationChart,
  },
})
export default class Charts extends Vue {}
</script>

<style lang="scss" scoped>
.view-charts {
  //
}
</style>
