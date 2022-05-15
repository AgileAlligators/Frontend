<template>
  <AASection
    v-pex="'account.change.password'"
    class="aa-account-reset-password"
    title="Passwort zurücksetzen"
  >
    <div class="inputs">
      <AAFormSelect
        title="Account"
        :values="accounts"
        :multiple="false"
        :value="dto.accountId"
        @input="dto.accountId = $event"
      />

      <AAFormInput
        v-model="dto.newPassword"
        type="password"
        title="Neues Passwort"
      />
      <AAFormInput
        v-model="dto.newPasswordR"
        type="password"
        title="Neues Passwort wiederholen"
      />
    </div>
    <vm-button
      title="Passwort zurücksetzen"
      variant="border"
      background="alarm"
      :disabled="sending || disabled"
      @click="resetPassword"
    />
  </AASection>
</template>

<script lang="ts">
import { User } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import AAFormSelect from '../forms/elements/AAFormSelect.vue';
import AASection from '../AASection.vue';

@Component({
  components: {
    AASection,
    AAFormSelect,
    AAFormInput,
  },
})
export default class AAAccountResetPassword extends Vue {
  @Prop({ default: () => [] }) accounts!: User[];

  public sending = false;
  public dto = {
    accountId: null,
    newPassword: '',
    newPasswordR: '',
  };

  public get disabled(): boolean {
    return Object.values(this.dto).some((x) => !x || x.length === 0);
  }

  public resetPassword(): void {
    if (this.sending) return;

    const { newPassword, newPasswordR, accountId } = this.dto;
    if (newPassword !== newPasswordR) {
      sendNotification({
        title: 'Passwort kann nicht zurückgesetzt werden',
        text: 'Das Passwort stimmt nicht überein',
      });
      return;
    }
    if (accountId === null) {
      sendNotification({
        title: 'Passwort kann nicht zurückgesetzt werden',
        text: 'Es wurde kein Account ausgewählt',
      });
      return;
    }

    this.sending = true;
    backend
      .patch('account/password/' + this.dto.accountId, this.dto)
      .then(({ data }) =>
        sendNotification({
          title: `Passwort ${data ? 'erfolgreich' : 'nicht'} zurückgesetzt!`,
        })
      )
      .catch(({ messages }) =>
        sendNotification({
          title: 'Fehler beim Zurücksetzen',
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
.aa-account-reset-password {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
