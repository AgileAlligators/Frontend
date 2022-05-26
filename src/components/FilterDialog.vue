<template>
  <vm-dialog :value="filterDialog" title="Filter">
    <table>
      <thead>
        <tr>
          <template v-for="(value, option) in filterSettings">
            <th :key="value.id">{{ option }}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(value, key) in filterSettings" :key="value.ID">
            <ul>
              <li v-for="(item, val) in value" :key="val">
                <AAIconButton
                  :class="{ 'selected-button': item }"
                  @click="updateFilter(key, val)"
                  :key="val"
                >
                  {{ val }}
                </AAIconButton>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <AAIconButton class="exit-button" @click="closeFilterDialog()">
      Fertig
    </AAIconButton>
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
  updateFilter(customer: string, key: string): void {
    this.$data.filterOptions[customer][key] =
      !this.$data.filterOptions[customer][key];
  }
}
</script>

<style lang="scss" scoped>
.selected-button {
  background: rgba(var(--vm-primary), 1);
  color: white;
}
ul {
  display: table-cell;
  list-style: none;
  padding: 0px;
}
.exit-button {
  float: right;
}
</style>
