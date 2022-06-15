<template>
  <AASection class="aa-chart-wrapper" :title="title" subtitle="Zeitraum wählen">
    <AAIconButton
      slot="title"
      @click="$store.commit('dialog_filter', true)"
      v-title="'Ladungsträger filtern'"
      icon="filter"
    />

    <div class="period-picker">
      <AAFormInput
        type="datetime-local"
        title="Beginn"
        :value="undefined"
        :allowDefaultNull="true"
        @input="updatePeriod('start', $event)"
        @reset="resetPeriod('start')"
      />
      <AAFormInput
        type="datetime-local"
        title="Ende"
        :value="undefined"
        :allowDefaultNull="true"
        @input="updatePeriod('end', $event)"
        @reset="resetPeriod('end')"
      />
    </div>

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
/* eslint-disable @typescript-eslint/no-explicit-any */

import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { getCounter, strippedFilter } from '@/utils/functions';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AAChartWrapper extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) endpoint!: string;
  @Prop({ required: true }) mapFunction!: (x: number) => string | number;
  @Prop({ required: true }) chartOptions!: any;
  @Prop({ required: true }) chartType!: string;

  public series = [];
  public period = { start: null as null | number, end: null as null | number };

  mounted(): void {
    this.resetPeriod('start', false);
    this.resetPeriod('end', false);
    this.loadData().then(noop);

    EventBus.$on('reload-carriers', () => this.loadData().then(noop));
  }

  public updatePeriod(period: 'start' | 'end', to: string): void {
    const timestamp = new Date(to).getTime();
    this.period[period] = timestamp;
    this.loadData().then(noop);
  }

  public resetPeriod(period: 'start' | 'end', reload = true): void {
    this.period[period] = null;
    if (reload) this.loadData().then(noop);
  }

  public async loadData(): Promise<void> {
    const options: Record<string, string[] | number> = strippedFilter();

    const { start, end } = this.period;
    if (start) options.start = new Date(start).getTime();
    if (end) options.end = new Date(end).getTime();

    const res = await backend.post(this.endpoint, options);
    const mapped = (
      res.data as { name: string; data: { x: number; y: number }[] }[]
    ).map(({ name, data }) => {
      return {
        name: name.length === 24 ? getCounter(name) : name,
        data: data.map(({ x, y }) => {
          return { x: x, y: this.mapFunction(y) };
        }),
      };
    });

    this.$set(this, 'series', mapped);
  }
}
</script>

<style lang="scss" scoped>
.aa-chart-wrapper {
  .period-picker {
    display: grid;
    @media only screen and(min-width: 550px) {
      grid-template-columns: 1fr 1fr;
    }
    grid-gap: 10px;

    margin-top: -10px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(var(--vm-border), 1);
    padding-bottom: 10px;
  }

  .chart-wrapper {
    width: calc(90vw - env(safe-area-inset-left) - env(safe-area-inset-right));
    @media #{$isDesktop} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right) - #{$sidebar-width}
      );
    }
    max-width: $max-width;
    overflow: auto;
  }
}
</style>
