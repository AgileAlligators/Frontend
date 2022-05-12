<template>
  <div class="aa-filter-dialog">
    <h1>Filter Dialog</h1>
    <AAIconButton @click="closeFilterDialog()">Abbrechen</AAIconButton>
    <AAIconButton @click="saveFilterOptions()">Speichern</AAIconButton>
    <template v-for="(value, option) in filterSettings">
      <AAIconButton
        :class="{ 'selected-button': value }"
        @click="updateFilter(option)"
        :key="option"
      >
        {{ option }}
      </AAIconButton>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';
import filterStore from '@/store/filterStore';

@Component({
  components: {
    AAIconButton,
  },
})
export default class FilterDialog extends Vue {
  get filterSettings(): { name: string; type: string; stuff: string } {
    this.$data.filterOptions = filterStore.getters.filterSettings;
    return filterStore.getters.filterSettings;
  }
  closeFilterDialog(): void {
    this.$data.filterOptions = this.filterSettings;
    this.$emit('clicked');
  }
  updateFilter(option: string): void {
    this.$data.filterOptions[option] = !this.$data.filterOptions[option];
  }
  saveFilterOptions(): void {
    filterStore.commit('updateFilter', this.$data.filterOptions);
    this.$emit('clicked');
  }
}
</script>

<style lang="scss" scoped>
.aa-filter-dialog {
  position: fixed;
  top: 20%;
  left: 40%;
  width: 400px;
  height: 300px;
  border: 1px solid black;
}
.selected-button {
  background: rgba(var(--vm-primary), 1);
  color: white;
}
</style>
