<template>
  <AAChartWrapper
    class="aa-idle-chart"
    title="Standzeiten"
    endpoint="location/idle/diagram"
    chartType="line"
    :chartOptions="options"
  />
</template>

<script lang="ts">
import { time } from '@/utils/functions';
import { Vue, Component } from 'vue-property-decorator';
import AAChartWrapper from './AAChartWrapper.vue';

@Component({ components: { AAChartWrapper } })
export default class AAIdleChart extends Vue {
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
        tickAmount: 12,
        labels: { formatter: (value: number) => time(value / 60) },
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
