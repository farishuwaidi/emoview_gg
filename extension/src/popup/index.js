import { createApp } from 'vue'
import { store } from '../store'
import { createAuth0 } from '@auth0/auth0-vue'
import './style.css'
import App from './Popup.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

createApp(App)
  .use(store)
  .use(
    createAuth0({
      domain: 'dev-fpv4uk28.us.auth0.com',
      client_id: 'ZX0iBHrlt4sRkjGWfcSxfcZUlBlvFYHY',
      redirect_uri: chrome.runtime.getURL('popup.html'),
      audience: 'https://dev-fpv4uk28.us.auth0.com/api/v2/',
    }),
  )
  .use(
    createVuetify({
      components,
      directives,
      theme: {
        defaultTheme: 'dark',
      },
    }),
  )
  .mount('#app')
