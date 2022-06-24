<template>
  <AAChartWrapper
    class="aa-load-over-time-chart"
    title="Vollzeit / Leerzeit"
    endpoint="load/diagram/time"
    chartType="bar"
    :chartOptions="$loadOverTimeChart"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AALoadOverTimeChart extends Vue {}
</script>
