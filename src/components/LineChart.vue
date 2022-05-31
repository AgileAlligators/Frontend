<template>
  <div class="lineDiagram">
    <apexchart
      width="1100"
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
.lineDiagram {
  //
}
</style>
