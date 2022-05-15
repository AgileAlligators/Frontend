<template>
  <AASection class="aa-account-change-password" title="Passwort ändern">
    <div class="inputs">
      <AAFormInput
        title="Altes Passwort"
        type="password"
        v-model="dto.oldPassword"
        autocomplete="current-password"
      />
      <AAFormInput
        title="Neues Passwort"
        type="password"
        v-model="dto.newPassword"
        autocomplete="new-password"
      />
      <AAFormInput
        title="Neues Passwort wiederholen"
        type="password"
        v-model="dto.newPasswordR"
        autocomplete="new-password"
      />
    </div>
    <vm-button
      title="Passwort ändern"
      variant="border"
      background="alarm"
      :disabled="sending || disabled"
      @click="changePassword"
    />
  </AASection>
</template>

<script lang="ts">
import { Authenticator } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component } from 'vue-property-decorator';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import AASection from '../AASection.vue';

@Component({ components: { AASection, AAFormInput } })
export default class AAAccountChangePassword extends Vue {
  public sending = false;
  public dto = {
    oldPassword: '',
    newPassword: '',
    newPasswordR: '',
  };

  public get disabled(): boolean {
    return Object.values(this.dto).some((x) => !x || x.length === 0);
  }

  public changePassword(): void {
    if (this.sending) return;

    const { newPassword, newPasswordR } = this.dto;
    if (newPassword !== newPasswordR) {
      sendNotification({
        title: 'Passwort kann nicht geändert werden',
        text: 'Das neue Passwort stimmt nicht überein',
      });
      return;
    }

    this.sending = true;
    backend
      .patch('account/password', this.dto)
      .then(({ data }) => {
        sendNotification({ text: 'Das Passwort wurde erfolgreich geändert!' });
        Authenticator.signIn(data);
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Passwort nicht geändert',
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
.aa-account-change-password {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
