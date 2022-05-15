<template>
  <AASection
    v-pex="'account.delete'"
    class="aa-account-delete-account"
    title="Account löschen"
  >
    <div class="inputs">
      <AAFormSelect
        title="Account"
        :values="accounts"
        :multiple="false"
        :value="accountId"
        @input="accountId = $event"
      />
    </div>
    <vm-button
      title="Account löschen"
      variant="border"
      background="error"
      :disabled="sending || !accountId"
      @click="deleteAccount"
    />
  </AASection>
</template>

<script lang="ts">
import { User } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormSelect from '../forms/elements/AAFormSelect.vue';
import AASection from '../AASection.vue';

@Component({
  components: { AASection, AAFormSelect },
})
export default class AAAccountDeleteAccount extends Vue {
  @Prop({ default: () => [] }) accounts!: User[];

  public sending = false;
  public accountId: string | null = null;

  public deleteAccount(): void {
    if (this.sending) return;

    if (this.accountId === null) {
      sendNotification({
        title: 'Account kann nicht gelöscht werden',
        text: 'Es wurde kein Account ausgewählt',
      });
      return;
    }

    this.sending = true;
    backend
      .delete('account/' + this.accountId)
      .then(({ data }) => {
        if (!data) {
          sendNotification({
            title: 'Fehler beim Löschen',
            text: 'Der Account existiert nicht',
          });
        } else {
          sendNotification({
            title: 'Account erfolgreich gelöscht!',
          });
          const update = this.accounts.filter(
            ({ id }) => id !== this.accountId
          );
          this.$emit('accounts', update);
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
.aa-account-delete-account {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
