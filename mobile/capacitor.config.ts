import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'in.ac.iiitd.campusplay',
  appName: 'CampusPlay',
  // Remote webview — loads the deployed web app
  server: {
    url: 'https://campusplay.iiitd.edu.in',
  },
  // Minimal local webDir (required by Capacitor CLI, but not used)
  webDir: 'www',
  android: {
    // Allow mixed content (HTTP within HTTPS contexts)
    allowMixedContent: true,
  },
}

export default config
