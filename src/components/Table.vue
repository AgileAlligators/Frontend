<template>
  <div>
    <table>
      <thead>
        <tr>
          <template v-for="value in ['id', 'type', 'customer', 'order']">
            <th :key="value" class="table-header">
              <div class="header-container">
                {{ value }}
                <div class="arrow-container">
                  <div @click="sort(value, 'asc')">
                    <aiChevronLeftVue
                      class="arrow-icon"
                      :class="{
                        'selected-sort':
                          currentSort === value && currentSortDir === 'asc',
                      }"
                    />
                  </div>
                  <div @click="sort(value, 'desc')">
                    <aiChevronRightVue
                      class="arrow-icon"
                      :class="{
                        'selected-sort':
                          currentSort === value && currentSortDir === 'desc',
                      }"
                      @click="sort(value, 'desc')"
                    />
                  </div>
                </div>
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in table">
          <tr colspan="3" v-if="filter(item)" :key="item.id">
            <td class="list-entry">
              <AAIconButton @click="selectEntry(item)">
                <div>{{ item.id }}</div>
                <div>{{ item.type }}</div>
                <div>{{ item.customer }}</div>
                <div>{{ item.order }}</div>
              </AAIconButton>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import aiChevronLeftVue from '@/icons/etc/aiChevronLeft.vue';
import aiChevronRightVue from '@/icons/etc/aiChevronRight.vue';
import Vue from 'vue';
import filterStore from '@/store/filterStore';
import AAIconButton from '@/components/AAIconButton.vue';
import { backend } from '@/utils/backend';
import { Constants } from '@/utils/constants';
export default Vue.extend({
  components: {
    aiChevronLeftVue,
    aiChevronRightVue,
    AAIconButton,
  },
  data() {
    return {
      table: [] as {
        customer: string;
        id: number;
        order: string;
        type: string;
      }[],
      currentSort: 'id' as string,
      currentSortDir: 'asc' as string,
      filterDialog: false as boolean,
    };
  },
  computed: {
    sortedTable(): {
      customer: string;
      id: number;
      order: string;
      type: string;
    }[] {
      const sortedTable = this.table;
      return sortedTable.sort(
        (
          a: { customer: string; id: number; order: string; type: string },
          b: { customer: string; id: number; order: string; type: string }
        ) => {
          let modifier = 1;
          if (this.currentSortDir === 'desc') {
            modifier = -1;
          }
          type ObjectKey = keyof typeof a;
          const currentSort = this.currentSort as ObjectKey;

          let entryA: string | number = a[currentSort];
          let entryB: string | number = b[currentSort];

          if (entryA < entryB) {
            return -1 * modifier;
          } else if (entryA > entryB) {
            return 1 * modifier;
          } else {
            return 0;
          }
        }
      );
    },
    currentFilter() {
      return filterStore.getters.filterSettings;
    },
  },
  watch: {
    sortedTable(newTable) {
      this.table = newTable;
    },
  },
  mounted() {
    backend
      .post('carrier/search', {
        Authorization: 'Bearer ' + Constants.ACCESS_TOKEN,
        data: {
          limit: 20,
          skip: 0,
        },
      })
      .then((response) => {
        this.table = response.data.results;
      });
  },
  methods: {
    sort(sort: string, direction: string): void {
      this.currentSort = sort;
      this.currentSortDir = direction;
    },
    filter(item: {
      customer: string;
      id: number;
      order: string;
      type: string;
    }): boolean {
      if (
        this.currentFilter.type[item.type] === true ||
        this.currentFilter.customer[item.customer] === true ||
        this.currentFilter.order[item.order] === true
      ) {
        return false;
      } else {
        return true;
      }
    },
    selectEntry(item: {
      customer: string;
      id: number;
      order: string;
      type: string;
    }): void {
      this.$router.push({ name: 'about' });
      filterStore.commit('selectCarrier', item);
    },
  },
});
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  height: 50px;
}
.arrow-container {
  width: 20px;
  padding-left: 10px;
}
.selected-sort {
  color: rgba(var(--vm-primary), 1);
}
svg {
  height: 20px;
  width: 20px;
  transform: rotate(90deg) !important;
}
.list-entry {
  border: 1px solid black;

  div {
    width: 150px;
    padding-right: 1px;
    padding-left: 1px;
    text-align: start;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.table-header {
  min-width: 150px;
  float: left;
}
</style>
