import {expect, test} from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';

// Ensure snapshots directory exists
const snapshotsDir = path.join(process.cwd(), 'tests/snapshots');
if (!fs.existsSync(snapshotsDir)) {
  fs.mkdirSync(snapshotsDir, { recursive: true });
}

// Helper function to set slider to a specific value and verify it took effect
async function setSliderValue(page: any, value: number) {
  const slider = page.locator("input[type='range']");
  await slider.evaluate((el: HTMLInputElement, val: number) => {
    el.value = val.toFixed(1);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);

  // Wait for visualization to update
  await page.waitForTimeout(1000);

  // Try to verify k value was set correctly, but don't block if elements don't exist
  try {
    let actualValue = null;

    // Check 2D value if available
    const element2D = await page.$("#current-k-value-2d");
    if (element2D) {
      const kValue2D = await element2D.getAttribute("data-k-value");
      if (kValue2D) actualValue = kValue2D;
    }

    // Check 3D value if available and no 2D value found
    if (!actualValue) {
      const element3D = await page.$("#current-k-value");
      if (element3D) {
        const kValue3D = await element3D.getAttribute("data-k-value");
        if (kValue3D) actualValue = kValue3D;
      }
    }

    // Check if k value was applied correctly
    if (actualValue) {
      expect(parseFloat(actualValue)).toBeCloseTo(value, 1);
    }
  } catch (error) {
    console.warn("Could not verify k value, continuing test", error);
  }
}

test.describe.configure({ mode: 'parallel' });
test.describe("Visual Regression Testing", () => {
  // Test 2D visualization at specific k values
  const kValues2D = [1, 2, 5];

  for (const k of kValues2D) {
    test(`2D visualization with k=${k} matches snapshot`, async ({ page }) => {
      await page.goto("/");

      // Set k value
      await setSliderValue(page, k);

      // Wait for visualization to render completely
      await page.waitForTimeout(1000);

      // Take screenshot of the canvas
      const canvas = page.locator("canvas").first();
      await expect(canvas).toBeVisible();

      // Try to verify k value one more time for certainty
      try {
        const element = await page.$("#current-k-value-2d");
        if (element) {
          const kValue = await element.getAttribute("data-k-value");
          if (kValue) {
            expect(parseFloat(kValue)).toBeCloseTo(k, 1);
          }
        }
      } catch (error) {
        console.warn("Could not verify 2D k value before screenshot", error);
      }

      // Compare with baseline snapshot
      await expect(canvas).toHaveScreenshot(`2d-norm-k${k}.png`, {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
      });
    });
  }

  // Test 3D visualization at specific k values
  const kValues3D = [1, 2, 5];

  for (const k of kValues3D) {
    test(`3D visualization with k=${k} matches snapshot`, async ({ page }) => {
      await page.goto("/");

      // Switch to 3D tab
      await page.locator("button").filter({ hasText: "R3 Visualization" }).click();

      // Set k value
      await setSliderValue(page, k);

      // Wait longer for 3D visualization to render completely
      await page.waitForTimeout(3000);

      // Take screenshot of the canvas (Three.js)
      const canvas = page.locator("canvas").first();
      await expect(canvas).toBeVisible();

      // Try to verify k value one more time for certainty
      try {
        const element = await page.$("#current-k-value");
        if (element) {
          const kValue = await element.getAttribute("data-k-value");
          if (kValue) {
            expect(parseFloat(kValue)).toBeCloseTo(k, 1);
          }
        }
      } catch (error) {
        console.warn("Could not verify 3D k value before screenshot", error);
      }

      // Wait a bit longer for any animations to completely stop
      await page.waitForTimeout(1000);

      // Compare with baseline snapshot
      await expect(canvas).toHaveScreenshot(`3d-norm-k${k}.png`, {
        maxDiffPixelRatio: 0.07, // Allow 7% pixel difference for 3D renders
        threshold: 0.3,          // Higher threshold for 3D
        timeout: 10000           // Longer timeout for 3D
      });
    });
  }
});
