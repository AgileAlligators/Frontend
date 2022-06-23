<template>
  <v-date-picker
    class="aa-time-input"
    mode="dateTime"
    is24hr
    :is-dark="$store.getters.dark"
    locale="de"
    color="green"
    show-weeknumbers
    v-model="innerValue"
  >
    <template v-slot="{ inputValue, inputEvents }">
      <input :value="inputValue" v-on="inputEvents" />
    </template>
  </v-date-picker>
</template>

<script lang="ts">
import { EventBus } from '@/utils/constants';
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class AATimeInput extends Vue {
  @Prop() value!: string;

  public innerValue = this.value;

  @Watch('value', { immediate: true })
  valueChanged(): void {
    this.innerValue = this.value;
  }

  @Watch('innerValue', { immediate: true })
  innerValueChanged(): void {
    this.$emit('input', this.innerValue);
    EventBus.$emit('reload-carriers');
  }
}
</script>

<style lang="scss" scoped>
.aa-time-input {
  input {
    min-width: unset;
    width: unset;
    display: block;

    font: inherit;
    color: inherit;
    outline: none;
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    padding: 0 7.5px;
    border-radius: 5px;
    height: 30px;
    opacity: 1;
    -webkit-appearance: none;
    border: 1px solid transparent;
    background: rgba(var(--vm-paragraph), 1);

    &:focus,
    &:active {
      border-color: rgba(var(--vm-border), 1);
      background: rgba(var(--vm-background), 1);
    }
  }
}
</style>
