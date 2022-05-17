<template>
  <div class="bar-chart">
    <apexchart
      width="1200"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BarChart extends Vue {
  options = {
    chart: {
      id: 'bar-chart',
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  };
  series = [
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];
}
</script>

<style lang="scss" scoped>
.bar-chart {
  //
}
</style>
