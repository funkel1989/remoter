import { getCurrentInstance, type Vuetify } from 'vue';

// Vuetify
import * as directives from 'vuetify/directives';
import * as components from 'vuetify/components';
import { createVuetify } from 'vuetify';

import { loadFonts } from './webfontloader';
loadFonts();

// Styles
import 'vuetify/styles';
import '../styles/variables.scss';
import '@mdi/font/css/materialdesignicons.css';

const lightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme,
    },
  },
});

/** Get vuetify instance */
export function useVuetify(): Vuetify {
  /** Vue instance proxy */
  const proxy = getCurrentInstance()?.proxy;
  if (proxy) {
    return proxy.$vuetify;
  } else {
    console.warn(
      `[vuetify] getCurrentInstance() returned null. Method must be called at the top of a setup() function.`
    );
  }
  return undefined as any;
}
