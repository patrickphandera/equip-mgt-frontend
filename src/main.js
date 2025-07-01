import { createApp } from 'vue'
import '@mdi/font/css/materialdesignicons.css' // <== Import the MDI font
import 'vuetify/styles'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify(
    {
      theme: {
        defaultTheme: 'customTheme',
        themes: {
          customTheme: {
            dark: false,
            colors: {
              primary: '4CAF50', // ← Change this to your desired primary color
              secondary: '#FFCDD2',
              success: '#4CAF50',
              error: '#FF5252',
              info: '#2196F3',
              warning: '#FB8C00',
            },
          },
        },
      },
    icons: {
        defaultSet: 'mdi',
      },
    }
)

createApp(App).use(router).use(vuetify).mount('#app')
