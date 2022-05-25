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
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class LineDiagram extends Vue {
  @Prop() categories!: [];
  @Prop() data!: [];

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
        name: 'series-1',
        data: this.data,
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.lineDiagram {
  //
}
</style>
