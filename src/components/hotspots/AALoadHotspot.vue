<template>
  <AASection
    class="aa-load-hotspot"
    title="Beladungsentwicklung"
    :subtitle="$date(timestamp) + ' Uhr'"
  >
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

    <div class="playback">
      <vm-flow :key="interval || 'a'">
        <AAIconButton
          v-if="!interval"
          @click="startInterval()"
          v-title="'Animation starten'"
          icon="play"
        />
        <AAIconButton
          v-else
          @click="stopInterval()"
          v-title="'Animation pausieren'"
          icon="pause"
        />
        <vm-action title="Geschwindigkeit anpassen">
          <AAIconButton
            v-title="'Geschwindigkeit anpassen'"
            icon="speed"
            slot="trigger"
          />
          <vm-action-item
            v-for="(interval, title) in intervals"
            :key="interval"
            :title="title"
            :color="updateInterval === interval && 'primary'"
            @click="setUpdateInterval(interval)"
          />
        </vm-action>
        <div class="bar" />
      </vm-flow>

      <vm-slider
        :min="start"
        :max="end"
        :step="step"
        :value="timestamp"
        @input="
          timestamp = +$event;
          updatePoints();
        "
      />
    </div>

    <div id="map" />
  </AASection>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import L, { LayerGroup, Map } from 'leaflet';
import AASection from '../AASection.vue';
import 'leaflet/dist/leaflet.css';
import AAIconButton from '../AAIconButton.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import { backend } from '@/utils/backend';
import { noop } from 'vue-class-component/lib/util';
import {
  carrierColor,
  date,
  getCounter,
  strippedFilter,
  toPercent,
} from '@/utils/functions';
import { EventBus } from '@/utils/constants';

interface Load {
  carrierId: string;
  dataTuples: [number, [number, number], number][];
}

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AALoadHotspot extends Vue {
  public map: Map | null = null;
  public layer: LayerGroup | null = null;

  public period = { start: null as null | number, end: null as null | number };
  public start = 0;
  public end = Date.now();
  public interval: number | null = null;
  public timestamp = 0;
  public step = 300000; // 5 Minuten
  public progress = 0;
  public updateInterval = 500;
  public zoomSet = false;

  public intervals = {
    'Sehr langsam': 1300,
    Langsam: 1000,
    Normal: 700,
    Schnell: 400,
    'Sehr schnell': 100,
  };

  public carriers: Load[] = [];

  public startInterval(): void {
    this.stopInterval();

    this.zoomSet = false;
    this.interval = setInterval(() => {
      const { end, start, timestamp } = this;
      if (timestamp > end) this.timestamp = start;
      else this.timestamp += this.step;

      this.updatePoints();
    }, this.updateInterval);
  }

  public stopInterval(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  public setUpdateInterval(to: number): void {
    this.updateInterval = to;
    this.stopInterval();
    this.startInterval();
  }

  mounted(): void {
    this.map = L.map('map', {
      center: [49.4683841, 8.4823945],
      zoom: 18,
      attributionControl: false,
      zoomControl: false,
      fadeAnimation: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.resetPeriod('start', false);
    this.resetPeriod('end', false);
    this.loadData().then(noop);

    this.$once('hook:beforeDestroy', this.stopInterval);

    EventBus.$on('reload-carriers', () => this.loadData().then(noop));
  }

  public updatePoints(): void {
    if (!this.map) return;
    if (this.layer) this.layer.removeFrom(this.map);

    this.layer = L.layerGroup();

    this.carriers.forEach(({ carrierId, dataTuples }) => {
      const record = dataTuples
        .sort((a, b) => a[0] - b[0])
        .filter(([timestamp]) => timestamp < this.timestamp)[0];

      if (record) {
        const [timestamp, coords, load] = record;

        const id = getCounter(carrierId);
        const perc = toPercent(load);
        const ts = date(timestamp);
        const tooltip = `#${id} | ${perc}% am ${ts} Uhr`;

        if (this.layer)
          L.circle(coords, {
            radius: 10,
            fillOpacity: load,
            weight: 0,
            color: carrierColor(carrierId),
          })
            .bindTooltip(tooltip, {})
            .addTo(this.layer);

        if (this.map && !this.zoomSet) {
          this.map.setView(coords, 18);
          this.zoomSet = true;
        }
      }
    });

    this.layer.addTo(this.map);
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
    this.stopInterval();
    const options: Record<string, string[] | number> = strippedFilter();

    const { start, end } = this.period;
    if (start) options.start = new Date(start).getTime();
    if (end) options.end = new Date(end).getTime();

    const { data } = await backend.post<Load[]>('hotspot/load', options);
    const timestamps = data.map((x) => x.dataTuples.map((d) => d[0])).flat();

    this.start = Math.min(...timestamps);
    this.end = Math.max(...timestamps);
    this.timestamp = this.start;
    this.carriers = data;

    // this.startInterval();
  }
}
</script>

<style lang="scss" scoped>
.aa-load-hotspot {
  .period-picker {
    display: grid;
    @media only screen and(min-width: 550px) {
      grid-template-columns: 1fr 1fr;
    }
    grid-gap: 10px;

    margin-top: -10px;
    border-bottom: 1px solid rgba(var(--vm-border), 1);
    padding-bottom: 10px;
  }

  .playback {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;

    background: rgba(var(--vm-background), 1);
    padding: 10px 5px;
    border-bottom: 1px solid rgba(var(--vm-border), 1);

    .bar {
      height: 1.5em;
      width: 2px;
      border-radius: 2px;
      background: rgba(var(--vm-border), 1);
    }

    .vm-slider {
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  #map {
    height: 500px;
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
    z-index: 0;
    overflow: hidden;
    background: rgba(var(--vm-container), 1);
  }
}
</style>
