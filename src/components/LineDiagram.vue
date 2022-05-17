<template>
  <div class="lineDiagram">
    <apexchart
      width="1200"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LineDiagram extends Vue {
  options = {
    chart: {
      id: 'line-chart',
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
.lineDiagram {
  //
}
</style>
