<template>
  <AASection
    class="aa-hotspot-wrapper"
    :title="title"
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
        <AAIconButton
          @click="printPlugin.printMap('CurrentSize', title)"
          v-title="'Bild herunterladen'"
          icon="download"
        />
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

    <div class="map-container">
      <div class="map-wrapper">
        <div ref="map" id="map" />
      </div>
      <transition name="loading">
        <div class="loading" v-if="loading">
          <vm-spinner color="#fff" />
          <p>Daten werden geladen</p>
        </div>
      </transition>
    </div>
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import {
  carrierColor,
  date,
  getCounter,
  strippedFilter,
  toPercent,
} from '@/utils/functions';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import L, { LayerGroup, Map, Control } from 'leaflet';
import { EventBus } from '@/utils/constants';
import 'leaflet/dist/leaflet.css';
import 'leaflet-easyprint';

interface Hotspot {
  _id: string;
  dataTuples: [number, [number, number], number][];
}

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AAHotspotWrapper extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) endpoint!: string;

  public map: Map | null = null;
  public printPlugin: Control | null = null;
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

  public loading = false;

  public intervals = {
    'Sehr langsam': 1300,
    Langsam: 1000,
    Normal: 700,
    Schnell: 400,
    'Sehr schnell': 100,
  };

  public carriers: Hotspot[] = [];

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
    this.map = L.map(this.$refs.map as HTMLElement, {
      center: [49.4683841, 8.4823945],
      zoom: 18,
      attributionControl: false,
      zoomControl: false,
      fadeAnimation: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.printPlugin = (L as any)
      .easyPrint({
        hidden: true,
        sizeModes: ['CurrentSize'],
        exportOnly: true,
      })
      .addTo(this.map);

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

    this.carriers.forEach(({ _id, dataTuples }) => {
      const record = dataTuples
        .sort((a, b) => a[0] - b[0])
        .filter(([timestamp]) => timestamp < this.timestamp)
        .reverse()[0];

      if (record) {
        // console.log(date(record[0]));
        const [timestamp, coords, load] = record;

        const id = getCounter(_id);
        const perc = toPercent(load);
        const ts = date(timestamp);
        const tooltip = `#${id} | ${perc}% am ${ts} Uhr`;

        if (this.layer)
          L.circle(coords, {
            radius: 10,
            fillOpacity: load,
            weight: 0,
            color: carrierColor(_id),
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
    this.loading = true;
    this.stopInterval();
    const options: Record<string, string[] | number> = strippedFilter();

    const { start, end } = this.period;
    if (start) options.start = new Date(start).getTime();
    if (end) options.end = new Date(end).getTime();

    const { data } = await backend.post<Hotspot[]>(this.endpoint, options);
    const timestamps = data.map((x) => x.dataTuples.map((d) => d[0])).flat();

    this.start = Math.min(...timestamps);
    this.end = Math.max(...timestamps);
    this.timestamp = this.start;
    this.carriers = data;

    this.loading = false;

    // this.startInterval();
  }
}
</script>

<style lang="scss" scoped>
.aa-hotspot-wrapper {
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
      margin-left: 7.5px;
    }

    .vm-slider {
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .map-container {
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
    z-index: 0;
    overflow: hidden;
    background: rgba(var(--vm-container), 1);

    #map {
      height: 500px;
      z-index: 0;
    }

    height: 500px;

    position: relative;
    .loading {
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      padding: 20px;
      background: rgba(#000, 0.4);
      backdrop-filter: saturate(180%) blur(20px);
      color: #fff;
      p {
        font-weight: 500;
        font-size: 1.1em;
      }
    }
  }

  .loading-enter,
  .loading-leave-to {
    opacity: 0;
    backdrop-filter: saturate(0%) blur(0px);
    background: rgba(#000, 0);
  }
  .loading-enter-active,
  .loading-leave-active {
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
}
</style>
