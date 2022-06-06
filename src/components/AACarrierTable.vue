<template>
  <div class="aa-carrier-table" v-if="carriers && carriers.length > 0">
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
</template>

<script lang="ts">
import { Carrier } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AACarrierTable extends Vue {
  @Prop({ default: [] }) carriers!: Carrier[];

  public dir = 1;
  public key: string | null = 'id';

  $refs!: {
    checkall: Vue;
  };

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
  border-radius: #{$border-radius / 2};
  max-width: 100%;

  @media #{$isDesktop} {
    width: calc(
      90vw - env(safe-area-inset-left) - env(safe-area-inset-right) - #{$sidebar-width}
    );
    max-width: $max-width;
  }
  @media #{$isMobile} {
    width: calc(90vw - env(safe-area-inset-left) - env(safe-area-inset-right));
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
</style>
