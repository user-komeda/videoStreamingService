import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, devices } from '@playwright/test'

const currentDir = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(currentDir, '../backend')
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'yarn dev',
      url: 'http://localhost:5173',
      name: 'Frontend',
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
    {
      command: 'yarn dev',
      url: 'http://localhost:8080/health',
      name: 'Backend',
      cwd: backendDir,
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
  ],
})
