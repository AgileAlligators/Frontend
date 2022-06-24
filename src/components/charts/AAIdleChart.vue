<template>
  <AAChartWrapper
    class="aa-idle-chart"
    title="Standzeiten"
    endpoint="location/idle/diagram"
    chartType="line"
    :chartOptions="$idleChart"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AAIdleChart extends Vue {}
</script>
