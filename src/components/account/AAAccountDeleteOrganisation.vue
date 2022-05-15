<template>
  <AASection
    v-pex="'account.organisation.delete'"
    class="aa-account-delete-organisation"
    title="Organisation löschen"
  >
    <div class="inputs">
      <AAFormSelect
        title="Organisation"
        :values="orgs"
        :multiple="false"
        v-model="organisation"
      />
    </div>
    <vm-button
      title="Organisation löschen"
      variant="border"
      background="error"
      :disabled="sending || !organisation"
      @click="deleteOrganisation"
    />
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormSelect from '../forms/elements/AAFormSelect.vue';
import AASection from '../AASection.vue';

@Component({
  components: { AASection, AAFormSelect },
})
export default class AAAccountDeleteOrganisation extends Vue {
  @Prop({ default: () => [] }) organisations!: string[];

  get orgs(): { id: string; title: string }[] {
    return this.organisations.map((o) => {
      return { id: o, title: o };
    });
  }

  public sending = false;
  public organisation: string | null = null;

  public deleteOrganisation(): void {
    if (this.sending) return;

    if (this.organisation === null) {
      sendNotification({
        title: 'Organisation kann nicht gelöscht werden',
        text: 'Es wurde keine Organisation ausgewählt',
      });
      return;
    }

    this.sending = true;
    backend
      .delete('account/organisation' + this.organisation)
      .then(({ data }) => {
        if (!data) {
          sendNotification({
            title: 'Fehler beim Löschen',
            text: 'Die Organisation existiert nicht',
          });
        } else {
          sendNotification({
            title: 'Organisation erfolgreich gelöscht!',
          });
          const update = this.organisations.filter(
            (o) => o !== this.organisation
          );
          this.$emit('organisations', update);
        }
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Fehler beim Löschen',
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
.aa-account-delete-organisation {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
