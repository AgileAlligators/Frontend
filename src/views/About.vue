<template>
  <AAView class="view-about">
    <select v-model="selected">
      <template v-for="item in options">
        <option :value="item" :key="item">
          {{ item }}
        </option>
      </template>
    </select>
    <div>
      <label for="startTime">Anfangszeit:</label>
      <vm-input v-model="startingDate" type="date" />
    </div>
    <div>
      <label for="startTime">Endzeit:</label>
      <vm-input v-model="endingDate" type="date" />
    </div>
    <AAIconButton @click="updateTimeFrame">Diagramm aktualisieren</AAIconButton>
    <LineDiagram
      v-if="selected === 'Line Chart'"
      :categories="carrierTimeStamps"
      :data="carrierLoad"
    />
    <BarChart
      v-else-if="selected === 'Bar Chart'"
      :categories="carrierTimeStamps"
      :data="carrierLoad"
    />
    <div v-if="Object.keys(selectedCarrier).length > 0">
      Ausgewählter Ladungsträger: {{ selectedCarrier }}
    </div>
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import LineDiagram from '@/components/LineDiagram.vue';
import BarChart from '@/components/BarChart.vue';
import AAIconButton from '@/components/AAIconButton.vue';
import { backend } from '@/utils/backend';
import filterStore from '@/store/filterStore';

@Component({ components: { AAView, LineDiagram, BarChart, AAIconButton } })
export default class About extends Vue {
  selected = '';
  options = ['Line Chart', 'Bar Chart'];
  startingDate = '';
  endingDate = '';
  carrierTimeStamps: number[] = [];
  carrierLoad: number[] = [];

  get selectedCarrier(): {
    customer: string;
    id: number;
    order: string;
    type: string;
  } {
    return filterStore.getters.currentSelectedCarrier;
  }

  created(): void {
    this.selected = this.options[0];
  }
  updateTimeFrame(): void {
    // convert to unix
    const startTime = Math.floor(new Date(this.startingDate).getTime() / 1000);
    const endTime = Math.floor(new Date(this.endingDate).getTime() / 1000);
    if (startTime > endTime) {
      console.error('selected dates not correct');
      return;
    }
    const request = {
      ids: [String(this.selectedCarrier.id)],
      dataRequest: 'loadOverTime',
      start: startTime,
      end: endTime,
    };
    backend.post('diagram/line-diagram', request).then((response) => {
      if (response.data.length > 0) {
        response.data[0].dataPairs.forEach((element: number[]) => {
          this.carrierTimeStamps.push(element[0]);
          this.carrierLoad.push(element[1]);
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.view-about {
  //
}
</style>
