<template>
  <vm-dialog :value="filterDialog" title="Filter">
    <template v-for="(value, option) in filterSettings">
      <AAIconButton
        :class="{ 'selected-button': value }"
        @click="updateFilter(option)"
        :key="option"
      >
        {{ option }}
      </AAIconButton>
    </template>
    <AAIconButton @click="closeFilterDialog()">Fertig</AAIconButton>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';
import filterStore from '@/store/filterStore';

@Component({
  components: {
    AAIconButton,
  },
})
export default class FilterDialog extends Vue {
  @Prop() filterDialog!: boolean;
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
}
</script>

<style lang="scss" scoped>
.selected-button {
  background: rgba(var(--vm-primary), 1);
  color: white;
}
</style>
