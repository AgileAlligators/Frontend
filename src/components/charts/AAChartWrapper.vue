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
    <div class="chart-wrapper">
      <apexchart
        :type="chartType"
        height="500"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { getCounter, strippedFilter } from '@/utils/functions';
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
        const mapped = (data as Chart[]).map(({ name, data }) => {
          return {
            name: name.length === 24 ? 'LT#' + getCounter(name) : name,
            data,
          };
        });
        this.controller = null;
        this.$set(this, 'series', mapped);
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
