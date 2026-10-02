import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' as const }]
})

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'custom-elements',
          globals: true,
          setupFiles: ['./test/setup.js'],
          browser: browser()
        }
      },
      {
        extends: true,
        test: {
          name: 'mutation-observer',
          globals: true,
          setupFiles: ['./test/no_custom_elements.js', './test/setup.js'],
          browser: browser()
        }
      }
    ]
  }
})
