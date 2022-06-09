<template>
  <AASection
    class="aa-carrier-table"
    title="Übersicht der Ladungsträger"
    :subtitle="subtitle"
  >
    <AAIconButton
      slot="title"
      @click="$store.commit('dialog_filter', true)"
      v-title="'Ladungsträger filtern'"
      icon="filter"
    />

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <td>
              <vm-checkbox v-title="'Alle auswählen'" v-model="allSelected" />
            </td>
            <th
              v-for="(v, k) in headers"
              @click="sort(k)"
              :key="k"
              :sort="key === k"
            >
              <span>
                {{ v }}
                <ai-chevron-right :sort="key === k" :dir="dir" />
              </span>
            </th>
          </tr>
        </thead>
        <transition-group tag="tbody" name="tbody">
          <tr v-for="c in items" :key="c.id">
            <td>
              <vm-checkbox
                v-title="'Im Diagramm anzeigen'"
                v-model="$store.state.selection[c.id]"
              />
            </td>
            <td v-for="(_, k) in headers" :key="k">
              {{ k === 'id' ? '#' + $counter(c[k]) : c[k] }}
            </td>
          </tr>
        </transition-group>
      </table>
    </div>

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
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { strippedFilter } from '@/utils/functions';
import { Carrier } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from './AAIconButton.vue';
import AASection from './AASection.vue';

@Component({ components: { AASection, AAIconButton } })
export default class AACarrierTable extends Vue {
  public dir = 1;
  public key: string | null = 'id';

  public amount = 20;
  public total = 0;
  public carriers: Carrier[] = [];

  $refs!: {
    checkall: Vue;
  };

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
    return total + ' • ' + page;
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
        if (this.page > this.pages) {
          this.$router.push({ query: { page: `${this.pages}` } });
        }
      });
  }

  // Table stuff

  get allSelected(): boolean {
    return this.carriers.every((c) => this.$store.state.selection[c.id]);
  }

  set allSelected(state: boolean) {
    this.carriers.forEach((c) => {
      this.$store.state.selection[c.id] = state;
    });
    this.$forceUpdate();
  }

  public headers = {
    id: '#ID',
    type: 'LT Art',
    customer: 'Kunde',
    order: 'Bestellung',
  };

  get items(): Carrier[] {
    if (!this.key) return this.carriers;
    return (this.carriers as unknown as Record<string, string | number>[]).sort(
      (a, b) => {
        if (!this.key) return 0;
        const aa = a[this.key];
        const bb = b[this.key];
        if (typeof aa === 'number' && typeof bb === 'number') {
          return this.dir * (aa - bb);
        }
        return this.dir * `${aa}`.localeCompare(`${bb}`);
      }
    ) as unknown as Carrier[];
  }

  public sort(key: string): void {
    this.dir = this.key === key ? -this.dir : 1;
    this.key = key;
  }
}
</script>

<style lang="scss" scoped>
.aa-carrier-table {
  .table-wrapper {
    border-radius: #{$border-radius / 2};
    max-width: 100%;

    @media #{$isDesktop} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right) - #{$sidebar-width}
      );
      max-width: $max-width;
    }
    @media #{$isMobile} {
      width: calc(
        90vw - env(safe-area-inset-left) - env(safe-area-inset-right)
      );
    }
    overflow: auto;

    table {
      width: 100%;
      text-align: left;
      border-collapse: collapse;

      thead td {
        padding: 0 10px;
      }
      tbody {
        td {
          padding: 10px;
          white-space: nowrap;

          &:not(:first-child) {
            text-transform: uppercase;
            font-size: 0.75em;
            font-weight: bold;
            opacity: 0.75;
          }
          &:first-child {
            font-weight: 500;
          }
        }
      }

      th {
        font-weight: normal;
        white-space: nowrap;
        color: rgba(var(--vm-color-secondary), 1);
        font-weight: 500;

        &[sort] {
          color: rgba(var(--vm-primary), 1);
          font-weight: 550;
        }

        span {
          padding: 10px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;
          user-select: none;

          svg {
            height: 0.5em;
            margin-left: 0.33em;
            transition: transform 0.1s ease-in-out;

            &[sort][dir='1'] {
              transform: rotate(-90deg);
            }
            &[sort][dir='-1'] {
              transform: rotate(90deg);
            }
          }
        }
      }

      thead {
        background: rgba(var(--vm-background), 0.5);
      }

      tbody tr {
        border-top: 1px solid rgba(var(--vm-border), 1);
        &:nth-child(ODD) {
          background: rgba(var(--vm-container), 0.5);
        }
        &:hover {
          background: rgba(var(--vm-background), 1);
        }
      }
    }

    .tbody-move {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.25, 1);
      &:nth-child(ODD) {
        transition-delay: 0.15s;
        transition-duration: 0.35s;
      }
    }
  }

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
