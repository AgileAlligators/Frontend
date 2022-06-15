<template>
  <AAChartWrapper
    class="aa-idle-chart"
    title="Standzeiten"
    endpoint="diagram/idle"
    chartType="bar"
    :chartOptions="options"
    :mapFunction="mapFunction"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AAIdleChart extends Vue {
  public mapFunction = (y: number): number => Math.round(y * 10000) / 100;

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
          enabled: true,
          autoScaleYaxis: true,
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: { formatter: (value: number) => value + '%' },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
      },
      stroke: { lineCap: 'round', width: 3, curve: 'straight' },
      theme: { mode: this.$store.getters.dark ? 'dark' : 'light' },
      dataLabels: { enabled: false },
    };
  }
}
</script>
