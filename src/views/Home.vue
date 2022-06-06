<template>
  <AAView class="view-home">
    <!-- <Table /> -->
    <AASection title="Übersicht der Ladungsträger" :subtitle="subtitle">
      <AAIconButton
        slot="title"
        @click="$store.commit('dialog_filter', true)"
        v-title="'Ladungsträger filtern'"
        icon="filter"
      />

      <AACarrierTable
        :carriers="carriers"
        v-if="carriers && carriers.length > 0"
      />

      <vm-flow class="pages" v-if="pages > 1" horizontal="center">
        <div class="page-selector" :disabled="page <= 1" @click="prevPage">
          <ai-chevron-left />
        </div>

        <div class="page">{{ page }} von {{ pages }}</div>
        <div class="page-selector" :disabled="page >= pages" @click="nextPage">
          <ai-chevron-right />
        </div>
      </vm-flow>
    </AASection>

    <AALoadChart />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import Table from '@/components/Table.vue';
import AASection from '@/components/AASection.vue';
import { EventBus } from '@/utils/constants';
import { Carrier } from '@/utils/interfaces';
import { backend } from '@/utils/backend';
import AACarrierTable from '@/components/AACarrierTable.vue';
import AAIconButton from '@/components/AAIconButton.vue';
import { getCounter, strippedFilter } from '@/utils/functions';
import AALoadChart from '@/components/charts/AALoadChart.vue';

@Component({
  components: {
    AAView,
    Table,
    AASection,
    AAIconButton,
    AACarrierTable,
    AALoadChart,
  },
})
export default class Home extends Vue {
  public amount = 20;
  public total = 0;
  public carriers: Carrier[] = [];

  mounted(): void {
    this.loadCarriers();
    EventBus.$on('reload-carriers', this.loadCarriers);
  }

  get page(): number {
    return +this.$route.query.page || 1;
  }

  get pages(): number {
    return Math.ceil(this.total / this.amount);
  }

  get subtitle(): string | null {
    const { length } = this.carriers;
    if (length === this.total) return null;

    const page = `Seite ${this.page}/${this.pages}`;
    if (length === 0) return page;
    const total = `Zeige ${length}/${this.total} Ladungsträger`;
    return total + ', ' + page;
  }

  public nextPage(): void {
    if (this.page >= this.pages) return;
    this.$router.push({ query: { page: `${this.page + 1}` } });
  }

  public prevPage(): void {
    if (this.page <= 1) return;
    this.$router.push({ query: { page: `${this.page - 1}` } });
  }

  public loadCarriers(): void {
    backend
      .post('carrier/search', {
        ...strippedFilter(),
        skip: (this.page - 1) * this.amount,
        limit: this.amount,
      })
      .then(({ data }) => {
        this.total = data.total;
        this.carriers = data.results;
      });
  }
}
</script>

<style lang="scss" scoped>
.view-home {
  .vm-flow.pages {
    margin-top: 20px;

    .page-selector {
      display: grid;
      place-content: center;
      border-radius: 50%;
      border: 1px solid rgba(var(--vm-color), 1);

      height: 1.6em;
      width: 1.6em;

      cursor: pointer;
      user-select: none;
      transition: 0.2s ease-in-out;

      &:not([disabled]):hover {
        background: rgba(var(--vm-color), 1);
        color: rgba(var(--vm-background), 1);
      }
      &:not([disabled]):active {
        transform: scale(0.9);
      }

      &[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      svg {
        height: 0.8em;
      }
    }
    .page {
      margin: 0 15px;
      display: grid;
      place-content: center;
      cursor: default;
    }
  }
}
</style>
