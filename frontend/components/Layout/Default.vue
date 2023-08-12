<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="!isPopup"
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar v-if="!isPopup" clipped-left fixed app elevate-on-scroll>
      <v-app-bar-nav-icon aria-label="sidebar" @click.stop="drawer = !drawer" />
      <v-btn
        aria-label="mini-sidebar"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-chevron-{{ miniVariant ? 'right' : 'left' }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn aria-label="darkmode" class="me-2" icon @click="isDark = !isDark">
        <v-icon>{{ darkModeIcon }}</v-icon>
      </v-btn>
      <v-menu v-if="$auth.loggedIn" min-width="220px" rounded offset-y bottom>
        <template #activator="{ on }">
          <v-btn icon height="38" width="38" class="me-1" v-on="on">
            <v-avatar color="secondary" size="38">
              <v-img :src="profile?.picture" :alt="profile?.name" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center pb-0">
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mb-4">
                <v-img :src="profile?.picture" :alt="profile?.name" />
              </v-avatar>
              <p class="text-body-1 font-weight-bold mb-0">
                {{ profile?.name }}
              </p>
              <p class="text-caption mt-1">{{ profile?.email }}</p>
              <v-divider></v-divider>
              <NuxtLink class="text-decoration-none" :to="{ name: 'profile' }">
                <v-btn class="text-capitalize no-active" height="48" text block
                  ><v-icon class="me-2">mdi-account</v-icon>Profile</v-btn
                >
              </NuxtLink>
              <v-divider></v-divider>
              <v-btn
                class="text-capitalize"
                height="48"
                text
                block
                @click="$auth.logout()"
                ><v-icon class="me-2">mdi-logout</v-icon>Logout</v-btn
              >
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <v-btn
        v-else
        color="primary"
        class="text-capitalize"
        aria-label="Login"
        depressed
        @click="$auth.loginWith('auth0', { params: { prompt: 'login' } })"
        >Login</v-btn
      >
    </v-app-bar>
    <v-main>
      <slot>
        <v-container>
          <Nuxt />
        </v-container>
      </slot>
    </v-main>
    <v-footer v-if="!isPopup" inset absolute app>
      <span>&copy; {{ new Date().getFullYear() }}, Derry Dwi Aditya</span>
    </v-footer>
    <BaseSnackbar />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Chart as ChartJS } from 'chart.js'

ChartJS.defaults.font.family = 'Inter, Helvetica, Arial, sans-serif'

export default {
  name: 'LayoutDefault',
  data() {
    return {
      drawer: true,
      miniVariant: true,
      title: 'EmoView',
    }
  },
  computed: {
    ...mapGetters('profile', ['profile']),
    isDark: {
      get() {
        return this.$vuetify.theme.dark
      },
      async set() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        const pathNeedReload = [
          'index',
          'student-studentId',
          'recognition-meetingId-studentId',
          'recognition-meetingId-all',
        ]
        if (pathNeedReload.includes(this.$route.name)) {
          const route = this.$route
          await this.$router.replace({ name: 'profile' })
          this.$router.replace(route)
        }
      },
    },
    darkModeIcon() {
      return this.isDark ? 'mdi-brightness-2' : 'mdi-brightness-7'
    },
    items() {
      const itemsNotLoggedIn = [
        {
          icon: 'mdi-view-dashboard-outline',
          title: 'Home',
          to: { name: 'index' },
        },
      ]
      const itemsLoggedIn = [
        ...itemsNotLoggedIn,
        {
          icon: 'mdi-emoticon-outline',
          title: 'Recognition',
          to: { name: 'recognition' },
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'Student',
          to: { name: 'student' },
        },
      ]
      const itemsSuperAdmin = [
        ...itemsLoggedIn,
        {
          icon: 'mdi-human-male-board',
          title: 'Teacher',
          to: { name: 'teacher' },
        },
      ]
      return this.$auth.loggedIn
        ? this.$auth.hasScope('superadmin')
          ? itemsSuperAdmin
          : itemsLoggedIn
        : itemsNotLoggedIn
    },
    isPopup() {
      return this.$route.fullPath.includes('popup')
    },
  },
  watch: {
    '$vuetify.theme.dark': {
      handler() {
        if (this.$vuetify.theme.dark) {
          this.$colorMode.preference = 'dark'
          ChartJS.defaults.color = 'white'
          ChartJS.defaults.borderColor = 'rgba(255,255,255,0.3)'
        } else {
          this.$colorMode.preference = 'light'
          ChartJS.defaults.color = '#666'
          ChartJS.defaults.borderColor = 'rgba(0,0,0,0.1)'
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.$auth.loggedIn) return
    this.fetchProfile()
  },
  methods: {
    ...mapActions('profile', ['fetchProfile']),
  },
}
</script>
