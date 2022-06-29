<template>
  <AASection
    class="aa-hotspot-wrapper"
    :title="title"
    :subtitle="$date(timestamp) + ' Uhr'"
  >
    <vm-flow slot="title">
      <vm-spinner size="5px" v-if="controller" />
      <AAIconButton
        @click="$store.commit('dialog_filter', true)"
        v-title="'Ladungsträger filtern'"
        icon="filter"
      />
    </vm-flow>

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
      <div ref="info" id="info" class="hidden">
        <div ref="cId" />
        <div ref="val" />
        <div ref="ts" />
      </div>
    </div>
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import {
  carrierDetails,
  date,
  getCounter,
  scale,
  strippedFilter,
  time,
  toPercent,
} from '@/utils/functions';
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
  @Prop() type!: string;

  $refs!: {
    map: HTMLDivElement;
    info: HTMLDivElement;
    cId: HTMLDivElement;
    val: HTMLDivElement;
    ts: HTMLDivElement;
  };

  public heat = new HeatmapLayer({
    blur: 20,
    radius: 12,
    source: new VectorSource({ features: [] }),
    weight: (feature) => scale(feature.get('opacity'), 0, 1, 0.1, 1),
  });
  public map = new Map({});

  public start = 0;
  public end = Date.now();
  public interval: number | null = null;
  public timestamp = 0;
  public step = 300000; // 5 Minuten
  public progress = 0;
  public updateInterval = 500;

  public intervals = {
    'Sehr langsam': 1300,
    Langsam: 1000,
    Normal: 700,
    Schnell: 400,
    'Sehr schnell': 100,
  };

  public carriers: Hotspot[] = [];
  public controller: AbortController | null = null;

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
      this.displayFeatureInfo(e.pixel, true);
    });

    this.$once('hook:beforeDestroy', this.stopInterval);

    this.loadData();
    EventBus.$on('reload-carriers', this.loadData);
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

  public displayFeatureInfo(pixel: Pixel, isClick = false): void {
    const { info, cId, val, ts } = this.$refs;

    const feature = this.map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    });

    if (feature) {
      info.style.left = pixel[0] + 'px';
      info.style.top = pixel[1] + 'px';

      const v = feature.get('val');

      if (this.type === 'idle') val.innerHTML = time(v);
      else if (this.type === 'load') val.innerHTML = v + '%';
      else val.innerHTML = v;

      cId.innerText = 'LT#' + feature.get('cId');
      ts.innerText = feature.get('ts') + ' Uhr';

      if (isClick)
        carrierDetails(feature.getId() + '', feature.get('timestamp'));

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

        const cId = getCounter(_id);
        let opacity = data;
        if (this.type === 'idle') opacity = data / 60;

        const val = this.type === 'idle' ? data : toPercent(data);
        const ts = date(timestamp);

        const geometry = new Point(
          fromLonLat([Math.min(...coords), Math.max(...coords)])
        );

        feature.setGeometry(geometry);
        feature.setProperties({ cId, val, ts, opacity, timestamp });
      }
    });
  }

  public loadData(): void {
    this.stopInterval();

    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.timestamp = (this.$store.state.time.start || new Date()).getTime();

    backend
      .post<Hotspot[]>(this.endpoint, strippedFilter(), { signal })
      .then(({ data }) => {
        const timestamps = data
          .map((x) => x.dataTuples.map((d) => d[0]))
          .flat();

        this.carriers = data;

        this.heat.getSource()?.addFeatures(
          data.map(({ _id }) => {
            const feature = new Feature({ opacity: 0 });
            feature.setId(_id);
            return feature;
          })
        );

        if (this.carriers.length > 0) {
          this.start = Math.min(...timestamps);
          this.end = Math.max(...timestamps);
          this.timestamp = this.start;

          const center = data.filter(({ dataTuples }) =>
            dataTuples.filter(([timestamp]) => timestamp === this.start)
          )[0].dataTuples[0][1];

          this.map.getView().setCenter(fromLonLat(center.reverse()));
        }

        this.controller = null;
        // this.startInterval();
      });
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
  .playback {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;

    margin-top: -10px;
    padding: 0 5px 10px;

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
    border-radius: $border-radius;
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
      padding: 10px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

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

      // carrierId
      div:nth-child(1) {
        text-transform: uppercase;
        margin-bottom: 0.5em;
        font-size: 0.875em;
        font-weight: bold;
      }

      // value
      div:nth-child(2) {
        font-size: 1.75em;
        font-weight: bold;
      }

      // timestamp
      div:nth-child(3) {
        margin-top: 0.5em;
        font-size: 0.75em;
        font-weight: 600;
      }
    }

    position: relative;
  }
}
</style>
