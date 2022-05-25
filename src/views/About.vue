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
    <LineDiagram v-if="selected === 'Line Chart'" />
    <BarChart v-else-if="selected === 'Bar Chart'" />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import LineDiagram from '@/components/LineDiagram.vue';
import BarChart from '@/components/BarChart.vue';
import AAIconButton from '@/components/AAIconButton.vue';
import { backend } from '@/utils/backend';

@Component({ components: { AAView, LineDiagram, BarChart, AAIconButton } })
export default class About extends Vue {
  selected = '';
  options = ['Line Chart', 'Bar Chart'];
  startingDate = '';
  endingDate = '';

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
      ids: ['6281285f37be3a7921b94999'],
      dataRequest: 'loadOverTime',
      start: 1652632272000,
      end: 1652632892123,
    };
    backend.post('diagram/line-diagram', request).then((response) => {
      console.error(response);
    });
  }
}
</script>

<style lang="scss" scoped>
.view-about {
  //
}
</style>
