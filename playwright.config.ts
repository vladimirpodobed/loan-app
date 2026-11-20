import { defineConfig, devices } from '@playwright/test';
import { SMALL_LOAN_URL } from './config/env-data';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  reporter: 'html',

  use: {
    baseURL: SMALL_LOAN_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});