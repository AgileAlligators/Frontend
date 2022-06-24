<template>
  <AAView class="view-charts">
    <AATimeRange slot="static" />

    <AALoadChart />
    <AALoadOverTimeChart />
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
import AALoadOverTimeChart from '@/components/charts/AALoadOverTimeChart.vue';

@Component({
  components: {
    AAView,
    AATimeRange,
    AALoadChart,
    AALoadOverTimeChart,
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
