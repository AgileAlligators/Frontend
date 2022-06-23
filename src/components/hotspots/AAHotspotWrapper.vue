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
          @click="exportAsPNG"
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
      <div ref="info" id="info" class="hidden" />
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
  date,
  getCounter,
  scale,
  strippedFilter,
  toPercent,
} from '@/utils/functions';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import { EventBus } from '@/utils/constants';

import View from 'ol/View';
import Map from 'ol/Map';
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Pixel } from 'ol/pixel';

type DataTuple = [number, [number, number], number];
interface Hotspot {
  _id: string;
  dataTuples: DataTuple[];
}

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AAHotspotWrapper extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) endpoint!: string;

  $refs!: {
    map: HTMLDivElement;
    info: HTMLDivElement;
  };

  public heat = new HeatmapLayer({
    blur: 20,
    radius: 12,
    source: new VectorSource({ features: [] }),
    weight: (feature) => scale(feature.get('opacity'), 0, 1, 0.1, 1),
  });
  public map = new Map({});

  public period = { start: null as null | number, end: null as null | number };
  public start = 0;
  public end = Date.now();
  public interval: number | null = null;
  public timestamp = 0;
  public step = 300000; // 5 Minuten
  public progress = 0;
  public updateInterval = 500;

  public loading = false;

  public intervals = {
    'Sehr langsam': 1300,
    Langsam: 1000,
    Normal: 700,
    Schnell: 400,
    'Sehr schnell': 100,
  };

  public carriers: Hotspot[] = [];

  mounted(): void {
    this.map = new Map({
      target: this.$refs.map,
      layers: [new TileLayer({ source: new OSM() }), this.heat],
      view: new View({
        center: fromLonLat([8.4823945, 49.4683841]),
        zoom: 17,
        constrainResolution: true,
      }),
    });
    this.map.on('pointermove', (e: MapBrowserEvent<PointerEvent>) => {
      if (e.dragging) this.$refs.info.classList.add('hidden');
      else this.displayFeatureInfo(e.pixel);
    });
    this.map.on('click', (e: MapBrowserEvent<PointerEvent>) => {
      this.displayFeatureInfo(e.pixel);
    });

    this.resetPeriod('start', false);
    this.resetPeriod('end', false);
    this.loadData().then(noop);

    this.$once('hook:beforeDestroy', this.stopInterval);

    EventBus.$on('reload-carriers', () => this.loadData().then(noop));
  }

  public startInterval(): void {
    this.stopInterval();
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

  public displayFeatureInfo(pixel: Pixel): void {
    const { info } = this.$refs;
    info.style.left = pixel[0] + 'px';
    info.style.top = pixel[1] + 'px';

    const feature = this.map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    });
    if (feature) {
      info.innerHTML = feature.get('tooltip');
      info.classList.remove('hidden');
    } else info.classList.add('hidden');
  }

  private getClosest(dataTuples: DataTuple[]): DataTuple {
    return dataTuples.reduce((prev, curr) =>
      Math.abs(curr[0] - this.timestamp) < Math.abs(prev[0] - this.timestamp)
        ? curr
        : prev
    );
  }

  public updatePoints(): void {
    this.carriers.forEach(({ _id, dataTuples }) => {
      const record = this.getClosest(dataTuples);
      const feature = this.heat.getSource()?.getFeatureById(_id);

      if (feature) {
        const [timestamp, coords, data] = record;

        const id = getCounter(_id);
        const perc = toPercent(data);
        const ts = date(timestamp);
        const tooltip = `#${id} | ${perc}% am ${ts} Uhr`;

        const geometry = new Point(
          fromLonLat([Math.min(...coords), Math.max(...coords)])
        );
        const opacity = data;

        feature.setGeometry(geometry);
        feature.setProperties({ tooltip, opacity });
      }
    });
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
    // if (Math.pow(1, 1) === 1) return;

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

    this.heat.getSource()?.addFeatures(
      data.map(({ _id }) => {
        const feature = new Feature({ opacity: 0 });
        feature.setId(_id);
        return feature;
      })
    );

    const center = data.filter(({ dataTuples }) =>
      dataTuples.filter(([timestamp]) => timestamp === this.start)
    )[0].dataTuples[0][1];

    this.map.getView().setCenter(fromLonLat(center.reverse()));

    this.loading = false;

    // this.startInterval();
  }

  public exportAsPNG(): void {
    this.map.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      const size = this.map.getSize();
      if (!size) return;
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) return;

      Array.prototype.forEach.call(
        this.map
          .getViewport()
          .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;

      const a = document.createElement('a');
      a.href = mapCanvas.toDataURL();
      a.download = this.title;
      a.click();
      URL.revokeObjectURL(a.href);
    });
    this.map.renderSync();
  }
}
</script>

<style lang="scss">
.aa-hotspot-wrapper #map .ol-control {
  background: rgba(127, 127, 127, 0.25);
  backdrop-filter: saturate(180%) blur(20px);
  padding: 5px;
  button {
    background: rgba(var(--vm-primary), 0.5);
    cursor: pointer;
    &:hover {
      background: rgba(var(--vm-primary), 1);
    }
  }
}
</style>

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

    #info {
      position: absolute;
      transform: translate(-50%, -100%);
      z-index: 10;
      pointer-events: none;

      white-space: nowrap;
      font-weight: 500;
      padding: 2.5px 10px;
      border-radius: $border-radius;
      background: rgba(#000, 0.5);
      backdrop-filter: saturate(180%) blur(20px);
      color: #fff;

      transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
      transition-property: opacity, transform;
      &.hidden {
        transform: translate(-50%, 0%) scale(0);
        opacity: 0;
      }
    }

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
