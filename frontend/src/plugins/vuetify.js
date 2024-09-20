import 'vuetify/styles' // Ensure Vuetify styles are imported
import { createVuetify } from 'vuetify'

// Vuetify's theme setup (optional)
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242'
        }
      }
    }
  }
})

export default vuetify;
