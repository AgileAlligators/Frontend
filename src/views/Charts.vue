<template>
  <AAView class="view-charts">
    <AALoadChart />
    <AAIdleChart />
  </AAView>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import AAView from '@/components/AAView.vue';
import AALoadChart from '@/components/charts/AALoadChart.vue';
import AAIdleChart from '@/components/charts/AAIdleChart.vue';

@Component({ components: { AAView, AALoadChart, AAIdleChart } })
export default class Charts extends Vue {}
</script>

<style lang="scss" scoped>
.view-charts {
  //
}
</style>
