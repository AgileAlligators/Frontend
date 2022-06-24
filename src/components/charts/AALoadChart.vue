<template>
  <AAChartWrapper
    class="aa-load-chart"
    title="Beladung"
    endpoint="load/diagram"
    chartType="line"
    :chartOptions="$loadChart"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AALoadChart extends Vue {}
</script>
