<template>
  <AASection class="aa-chart-wrapper" :title="title">
    <vm-flow slot="title">
      <vm-spinner size="5px" v-if="controller" />
      <AAIconButton
        @click="$store.commit('dialog_filter', true)"
        v-title="'Ladungsträger filtern'"
        icon="filter"
      />
    </vm-flow>
    <div class="chart-wrapper" :key="categories.length">
      <apexchart
        :type="chartType"
        :height="categories.length === 0 ? 500 : categories.length * 120"
        :options="options"
        :series="series"
      />
    </div>
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { getCounter, mapLoadOverTime, strippedFilter } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';

type Chart = { name: string; data: { x: number; y: number }[] };

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AAChartWrapper extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) endpoint!: string;
  @Prop({ required: true }) chartOptions!: unknown;
  @Prop({ required: true }) chartType!: string;

  public series: Chart[] = [];
  public controller: AbortController | null = null;
  public categories: string[] = [];

  get options(): unknown {
    if (this.endpoint !== 'load/diagram/time') return this.chartOptions;
    else
      return Object.assign(this.chartOptions, {
        xaxis: { categories: this.categories },
      });
  }

  mounted(): void {
    this.loadData();
    EventBus.$on('reload-carriers', this.loadData);
  }

  public loadData(): void {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    backend
      .post(this.endpoint, strippedFilter(), { signal })
      .then(({ data }) => {
        this.controller = null;
        if (this.endpoint === 'load/diagram/time') {
          const { categories, series } = mapLoadOverTime(data);
          this.$set(this, 'categories', categories);
          this.$set(this, 'series', series);
        } else {
          const mapped = (data as Chart[]).map(({ name, data }) => {
            return {
              name: name.length === 24 ? 'LT#' + getCounter(name) : name,
              data,
            };
          });
          this.$set(this, 'series', mapped);
        }
      });
  }
}
</script>

<style lang="scss" scoped>
.aa-chart-wrapper {
  .chart-wrapper {
    width: calc(90vw - env(safe-area-inset-left) - env(safe-area-inset-right));
    @media #{$isDesktop} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right) - #{$sidebar-width}
      );
    }
    max-width: $max-width;

    @include aa-scrollbar();
    overflow: hidden;
  }
}
</style>
