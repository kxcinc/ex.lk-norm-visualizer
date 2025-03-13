import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Snapshot configuration for visual testing
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05, // Allow up to 5% of pixels to be different
      threshold: 0.2,         // Pixel difference threshold
      animations: "disabled", // Disable animations for consistent screenshots
    },
    timeout: 15000,          // Increase timeout for screenshot comparisons
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 } // Fixed viewport for consistency
      },
    },
    // Firefox is excluded due to inconsistent behavior with input range events
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 720 } // Fixed viewport for consistency
      },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
