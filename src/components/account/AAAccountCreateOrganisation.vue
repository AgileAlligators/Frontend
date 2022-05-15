<template>
  <AASection
    v-pex="'account.organisation.create'"
    class="aa-account-create-organisation"
    title="Neue Organisation erstellen"
  >
    <div class="inputs">
      <AAFormInput v-model="dto.name" title="Organisationsname" />
    </div>
    <vm-button
      title="Organisation erstellen"
      variant="border"
      background="success"
      :disabled="sending || disabled"
      @click="createOrganisation"
    />
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import AASection from '../AASection.vue';

@Component({ components: { AASection, AAFormInput } })
export default class AAAccountCreateOrganisation extends Vue {
  @Prop({ default: () => [] }) organisations!: string[];

  public sending = false;
  public dto = { name: '' };

  public get disabled(): boolean {
    return Object.values(this.dto).some((x) => !x || x.length === 0);
  }

  public createOrganisation(): void {
    if (this.sending) return;

    this.sending = true;
    backend
      .post('account/organisation', this.dto)
      .then(({ data }) => {
        sendNotification({
          title: 'Organisation erstellt!',
          text: `${data.username} kann nun zum Login verwendet werden`,
        });

        const update = [...this.organisations, data.organisation];
        this.$emit('organisations', update);
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Organisation nicht erstellt',
          text: messages[0],
        })
      )
      .then(() => {
        this.sending = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.aa-account-create-organisation {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
