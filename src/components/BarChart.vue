<template>
  <div class="bar-chart">
    <apexchart
      width="1100"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BarChart extends Vue {
  @Prop() categories!: [];
  @Prop() data!: [];
  @Prop() label!: string;

  get options() {
    return {
      chart: {
        id: 'line-chart',
      },
      xaxis: {
        categories: this.categories,
      },
    };
  }

  get series() {
    return [
      {
        name: this.label,
        data: this.data,
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.bar-chart {
  //
}
</style>
