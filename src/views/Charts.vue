<template>
  <AAView class="view-charts">
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

@Component({
  components: { AAView, AALoadChart, AAIdleChart, AAVibrationChart },
})
export default class Charts extends Vue {}
</script>

<style lang="scss" scoped>
.view-charts {
  //
}
</style>
