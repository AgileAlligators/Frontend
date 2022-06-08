<template>
  <AASection class="aa-load-chart" title="Beladung" subtitle="Zeitraum wählen">
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

    <apexchart
      ref="chart"
      type="line"
      height="500"
      width="100%"
      :options="options"
      :series="series"
    />
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { getCounter, strippedFilter } from '@/utils/functions';
import { Carrier } from '@/utils/interfaces';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';

@Component({ components: { AASection, AAFormInput, AAIconButton } })
export default class AALoadChart extends Vue {
  public series = [];
  public period = { start: null as null | number, end: null as null | number };

  mounted(): void {
    this.loadData().then(noop);
    this.resetPeriod('start');
    this.resetPeriod('end');

    EventBus.$on('reload-carriers', () => this.loadData().then(noop));
  }

  public updatePeriod(period: 'start' | 'end', to: string): void {
    const timestamp = new Date(to).getTime();
    this.period[period] = timestamp;
    this.loadData().then(noop);
  }

  public resetPeriod(period: 'start' | 'end'): void {
    this.period[period] = null;
    this.loadData().then(noop);
  }

  public async loadData(): Promise<void> {
    let ids: string[] = [];
    let { start, end } = this.period;
    if (start) start = new Date(start).getTime();
    if (end) end = new Date(end).getTime();

    const { data } = await backend.post('carrier/search', {
      ...strippedFilter(),
    });
    ids = (data.results as Carrier[]).map(({ id }) => id);

    backend
      .post('diagram/line-diagram', {
        dataRequest: 'loadOverTime',
        ids,
        start,
        end,
      })
      .then((res) => {
        const series = res.data.map(
          (d: { carrierId: string; dataPairs: number[][] }) => {
            return {
              name: '#' + getCounter(d.carrierId),
              data: d.dataPairs
                .sort((a, b) => a[0] - b[0])
                .map((p) => {
                  return { x: p[0], y: Math.round(p[1] * 10000) / 100 };
                }),
            };
          }
        );
        this.$set(this, 'series', series);
      });
  }

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
    };
  }
}
</script>

<style lang="scss" scoped>
.aa-load-chart {
  .period-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;

    margin-top: -10px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(var(--vm-border), 1);
    padding-bottom: 10px;
  }
}
</style>
