<template>
  <div class="view-account" content>
    <AASection
      :title="'Hallo, ' + account.username + '@' + account.organisation"
      subtitle="Informationen"
    >
      <vm-flow slot="title">
        <vm-button title="Abmelden" background="error" @click="signOut" />
      </vm-flow>
      Dein Login läuft am {{ loginLasts }} Uhr ab.
    </AASection>
    <AASection title="Berechtigungen" :subtitle="'Gruppe: ' + account.group">
      <div v-if="account.group === 'admin'">Du besitzt alle Berechtigungen</div>
      <template v-else>
        <vm-chip v-for="p in account.permissions" :key="p" :value="p" />
      </template>
    </AASection>

    <template v-if="account.organisation === 'ligenium'">
      <AAAccountCreateOrganisation
        :organisations="organisations"
        @organisations="organisations = $event"
      />
      <AAAccountDeleteOrganisation
        :organisations="organisations"
        @organisations="organisations = $event"
      />
    </template>
    <template v-else>
      <AAAccountChangePassword />
      <AAAccountCreateAccount
        :accounts="accounts"
        @accounts="accounts = $event"
      />
      <AAAccountResetPassword
        :accounts="accounts"
        @accounts="accounts = $event"
      />
      <AAAccountDeleteAccount
        :accounts="accounts"
        @accounts="accounts = $event"
      />
      <AAAccountChangeGroup
        :accounts="accounts"
        @accounts="accounts = $event"
      />
      <AAAccountChangePermissions
        :accounts="accounts"
        @accounts="accounts = $event"
      />
    </template>
  </div>
</template>

<script lang="ts">
import AAAccountChangeGroup from '@/components/account/AAAccountChangeGroup.vue';
import AAAccountChangePassword from '@/components/account/AAAccountChangePassword.vue';
import AAAccountChangePermissions from '@/components/account/AAAccountChangePermissions.vue';
import AAAccountCreateAccount from '@/components/account/AAAccountCreateAccount.vue';
import AAAccountDeleteAccount from '@/components/account/AAAccountDeleteAccount.vue';
import AAAccountResetPassword from '@/components/account/AAAccountResetPassword.vue';
import AASection from '@/components/AASection.vue';
import { Authenticator, User } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component } from 'vue-property-decorator';
import AAAccountDeleteOrganisation from '@/components/account/AAAccountDeleteOrganisation.vue';
import AAAccountCreateOrganisation from '@/components/account/AAAccountCreateOrganisation.vue';

@Component({
  components: {
    AASection,

    AAAccountChangePassword,
    AAAccountResetPassword,
    AAAccountCreateAccount,
    AAAccountDeleteAccount,
    AAAccountChangeGroup,
    AAAccountChangePermissions,

    AAAccountCreateOrganisation,
    AAAccountDeleteOrganisation,
  },
})
export default class Account extends Vue {
  public organisations: string[] = [];
  public accounts: User[] = [];

  mounted(): void {
    if (this.account.organisation === 'ligenium') {
      backend
        .get('account/organisation')
        .then(({ data }) => {
          this.organisations = data;
        })
        .catch(noop);
    } else {
      backend
        .get('account/')
        .then(({ data }) => {
          this.accounts = data;
          console.log('accounts', data);
        })
        .catch(noop);
    }
  }

  get account(): User {
    return this.$store.getters.user;
  }

  get loginLasts(): string {
    return Intl.DateTimeFormat('de-de', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .format(this.account.exp * 1000)
      .replace(',', ' um');
  }

  public signOut(): void {
    Authenticator.signOut();
  }
}
</script>

<style lang="scss" scoped>
.view-account {
  //
}
</style>
