<template>
  <AAChartWrapper
    class="aa-vibration-chart"
    title="Erschütterungen"
    endpoint="vibration/diagram"
    chartType="line"
    :chartOptions="$vibrationChart"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AAVibrationChart extends Vue {}
</script>
