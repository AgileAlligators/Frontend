<template>
  <div class="aa-form-select">
    <vm-action ref="select" :title="title">
      <span slot="trigger" />

      <div class="list-wrapper" @click.self.capture.stop>
        <div @click.capture.stop>
          <vm-input placeholder="Suchen..." v-model="filter" autofocus />
        </div>
        <vm-list>
          <vm-list-item
            v-for="{ id, title, name, username } in filtered"
            :key="id"
            :title="username || name || title"
            @click.capture.stop="toggle(id)"
            :color="isSelected(id) && 'primary'"
          />
        </vm-list>
      </div>
    </vm-action>
    <AAFormInput
      :disabled="true"
      :placeholder="inPlaceholder"
      :value="inValue"
      :title="title"
      @click.stop="$refs.select.toggleVisible()"
      @reset="reset"
    />
  </div>
</template>

<script lang="ts">
import { join } from '@/utils/functions';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import AAFormInput from './AAFormInput.vue';

interface Selectable {
  id: string;
  title: string;
  name?: string;
  username?: string;
}

@Component({ components: { AAFormInput } })
export default class AAFormSelect extends Vue {
  @Prop({ default: 'Select' }) title!: string;
  @Prop() placeholder!: string | string[];
  @Prop({ default: true }) multiple!: boolean;

  @Prop({ default: () => [] }) values!: Selectable[];
  @Prop() value!: string | string[];

  public filter = '';

  public innerValue: string | string[] =
    this.value || (this.multiple ? [] : '');

  @Watch('value', { deep: true, immediate: true })
  valueChanged(): void {
    this.innerValue = this.value || (this.multiple ? [] : '');
  }

  public reset(): void {
    this.innerValue = this.multiple ? [] : '';
    this.$emit('input', this.innerValue);
  }

  public toggle(id: string): void {
    if (this.multiple && Array.isArray(this.innerValue)) {
      if (this.innerValue.includes(id))
        this.innerValue = this.innerValue.filter((x) => x !== id);
      else this.innerValue.unshift(id);
    } else {
      if (this.innerValue === id) this.innerValue = '';
      else this.innerValue = id;
    }
    this.$emit('input', this.innerValue);
  }

  public isSelected(id: string): boolean {
    if (this.multiple && Array.isArray(this.innerValue)) {
      return this.innerValue.includes(id);
    }
    return this.innerValue === id;
  }

  get filtered(): Selectable[] {
    if (this.filter.length === 0) return this.values;
    return this.values.filter(({ name, title, username }) =>
      (username || name || title)
        .toLowerCase()
        .includes(this.filter.toLowerCase())
    );
  }

  private getIds(of: string | string[] | undefined): string[] {
    if (!of) return [];
    return Array.isArray(of) ? of : [of];
  }

  get inValue(): string {
    const ids = this.getIds(this.innerValue);
    return join(
      this.values
        .filter((x) => ids.includes(x.id))
        .map(({ title, username, name }) => username || name || title)
    );
  }

  get inPlaceholder(): string {
    const ids = this.getIds(this.placeholder);
    return join(
      this.values
        .filter((x) => ids.includes(x.id))
        .map(({ title, username, name }) => username || name || title)
    );
  }
}
</script>

<style lang="scss">
.aa-form-select .list-wrapper {
  .vm-input {
    margin: 2.5px 0;
  }
  .vm-input--input__background {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.aa-form-select {
  margin-top: -19px;
  .list-wrapper {
    width: 200px;
    max-width: 90vw;
    text-align: left;

    border: 1px solid rgba(var(--vm-border), 1);
    box-shadow: 2px 4px 10px rgba(#111, 0.07);
    border-radius: 0 0 7.5px 7.5px;

    .vm-list {
      max-height: 400px;
      overflow: auto;
      @include aa-scrollbar();
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
</style>
