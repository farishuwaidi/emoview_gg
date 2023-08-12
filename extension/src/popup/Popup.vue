<script setup>
import { useStore } from 'vuex'
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, ref } from 'vue'

const { loginWithPopup, isLoading, isAuthenticated, getAccessTokenSilently, logout } = useAuth0()
const store = useStore()

const isStart = computed(() => store.getters['user/isStart'])
const user = computed(() => store.getters['user/user'])
const newName = ref('')
const isChangeName = ref(false)

const handleLogin = () => {
  loginWithPopup({ prompt: 'login' }).then(async () => {
    const token = await getAccessTokenSilently()
    store.dispatch('user/fetchUser', token)
  })
}

const handleLogout = () => {
  logout().then(() => {
    store.dispatch('user/fetchUser', {})
    window.location.reload()
  })
}

const handleChangeNameToggle = () => {
  isChangeName.value = !isChangeName.value
  newName.value = store.getters['user/username']
}

const handleUpdateName = () => {
  store.dispatch('user/updateName', { name: newName.value }).then(() => {
    handleChangeNameToggle()
  })
}
</script>

<template>
  <main>
    <h5 class="text-h5 font-weight-bold text-center text-blue">EmoView Student</h5>
    <div v-if="isLoading" class="text-center mt-4 mb-2">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div v-if="isAuthenticated">
        <h6 v-if="isAuthenticated" class="text-body-1 mt-4 mb-2">Hello, {{ user?.name }}</h6>
        <v-switch
          v-model="isStart"
          :label="`Recognition ${isStart ? 'On' : 'Off'}`"
          class="mb-2"
          color="blue"
          inset
          readonly
          hide-details="true"
          @click="store.dispatch('user/toggleIsStart')"
        ></v-switch>
        <v-btn class="text-capitalize" block @click="handleChangeNameToggle">Change Name</v-btn>
        <form v-if="isChangeName" ref="form" @submit.prevent="handleUpdateName">
          <v-text-field
            v-model="newName"
            label="Enter your name"
            variant="solo"
            hide-details="true"
          ></v-text-field>
          <v-btn class="text-capitalize" type="submit" :disabled="!newName" block>Save</v-btn>
        </form>
        <v-btn class="text-capitalize" block @click="handleLogout">Logout</v-btn>
      </div>
      <v-btn v-else class="text-capitalize" block @click="handleLogin">Login</v-btn>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}

button {
  margin: 1rem 0;
}

h5,
h6,
p {
  cursor: default;
}
</style>
