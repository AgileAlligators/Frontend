<template>
  <AAChartWrapper
    class="aa-vibration-chart"
    title="Erschütterungen"
    endpoint="vibration/diagram"
    chartType="line"
    :chartOptions="options"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AAVibrationChart extends Vue {
  get options(): unknown {
    return {
      chart: {
        toolbar: { show: true },
        parentHeightOffset: 0,
        background: 'transparent',
        fontFamily: 'inherit',
        stacked: false,
        zoom: {
          type: 'x',
          enabled: false,
          autoScaleYaxis: true,
        },
      },
      yaxis: {
        min: 0,
        max: 1,
        tickAmount: 10,
        labels: {
          formatter: (value: number) => Math.round(value * 100) / 100,
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
      },
      stroke: { lineCap: 'round', width: 3, curve: 'straight' },
      theme: { mode: this.$store.getters.dark ? 'dark' : 'light' },
    };
  }
}
</script>
