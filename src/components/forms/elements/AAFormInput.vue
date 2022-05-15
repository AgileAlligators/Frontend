<template>
  <div class="aa-form-input">
    <div class="aa-form-input--title">{{ title }}</div>
    <div
      class="aa-form-input--input"
      @click="$emit('click', $event)"
      :button="showRemove"
    >
      <input
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        :inputmode="type === 'number' ? 'numeric' : type"
        :min="min && convert(min)"
        :max="max && convert(max)"
        v-model="innerValue"
        :style="{ backgroundColor: type === 'color' ? innerValue : undefined }"
        :list="options && options.length > 0 ? _uid : undefined"
        :autocomplete="autocomplete"
      />
      <AAIconButton
        v-if="showRemove"
        icon="remove"
        :remove="true"
        @click="
          innerValue = null;
          $emit('reset');
        "
      />
    </div>

    <datalist v-if="options && options.length > 0" :id="_uid">
      <option v-for="o in options" :key="o" :value="o" />
    </datalist>
  </div>
</template>

<script lang="ts">
import AAIconButton from '@/components/AAIconButton.vue';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({ components: { AAIconButton } })
export default class AAFormInput extends Vue {
  @Prop({ default: 'Input' }) title!: string;
  @Prop() placeholder!: string;
  @Prop() value!: string | number;
  @Prop() disabled!: boolean;
  @Prop({ default: 'text' }) type!: string;
  @Prop() min!: string | number;
  @Prop() max!: string | number;
  @Prop() options!: string[];
  @Prop({ default: true }) showRemove!: boolean;
  @Prop() autocomplete!: string;

  public innerValue = this.defaultValue || null;

  @Watch('innerValue')
  innerValueChanged(): void {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChanged(): void {
    this.innerValue = this.defaultValue || null;
  }

  get defaultValue(): string | number | undefined {
    return this.convert(this.value);
  }

  private convert(val: string | number): string | number | undefined {
    if (['text', 'color', 'password'].includes(this.type.toLowerCase()) && val)
      return val;
    if (this.title === 'number' && val) return Number.isNaN(+val) ? 0 : +val;

    const dtf = Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(
      !val ? Date.now() : Number.isNaN(+val) ? Date.now() : +val
    );

    const _ = (key: string) =>
      dtf.filter(({ type }) => type === key).map(({ value }) => value)[0];

    if (this.type === 'date') return `${_('year')}-${_('month')}-${_('day')}`;
    else if (this.type === 'datetime-local')
      return (
        `${_('year')}-${_('month')}-${_('day')}` +
        `T${_('hour')}:${_('minute')}`
      );

    return +val;
  }
}
</script>

<style lang="scss" scoped>
.aa-form-input {
  &--title {
    padding: 0 7.5px;
    font-weight: 500;
    font-size: 0.85em;
    color: rgba(var(--vm-color-secondary), 1);
  }
  &--input {
    display: grid;
    grid-gap: 10px;
    margin-top: 5px;

    &[button] {
      grid-template-columns: 1fr auto;
    }
    &:not([button]) input {
      height: 30px;
    }

    input {
      &,
      &:disabled {
        font: inherit;
        color: inherit;
        outline: none;
        transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
        padding: 0 7.5px;
        border-radius: 5px;
        opacity: 1;
        -webkit-appearance: none;
        border: 1px solid transparent;
        background: rgba(var(--vm-container), 1);

        &:focus,
        &:active {
          border-color: rgba(var(--vm-border), 1);
          background: rgba(var(--vm-background), 1);
        }
      }

      &:disabled {
        cursor: pointer;
      }

      &[type='color'] {
        cursor: pointer;

        height: unset;
        width: unset;
        display: block;

        &::-webkit-color-swatch-wrapper,
        &::-webkit-color-swatch {
          display: none;
        }
      }
    }
  }
}
</style>
