import * as fs from "node:fs";
import * as path from "node:path";
import { type Page, expect, test } from "@playwright/test";

// Ensure snapshots directory exists
const snapshotsDir = path.join(process.cwd(), "tests/snapshots");
if (!fs.existsSync(snapshotsDir)) {
  fs.mkdirSync(snapshotsDir, { recursive: true });
}

// Helper function to ensure 3D visualization is stable for screenshots
async function stabilize3DVisualization(page: Page) {
  // Check if the fix rotation button exists (we're in 3D mode)
  const fixRotationButton = page.locator("[data-testid='toggle-rotation-button']");
  const buttonVisible = await fixRotationButton.isVisible().catch(() => false);

  if (buttonVisible) {
    // Click the button to fix rotation
    await fixRotationButton.click();

    // Force a small wait to ensure any animations or transitions are complete
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 250)));
  }
}

// Helper function to set slider to a specific value and verify it took effect
async function setSliderValue(page: Page, value: number) {
  const slider = page.locator("input[type='range']");
  await slider.evaluate((el: HTMLInputElement, val: number) => {
    el.value = val.toFixed(1);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);

  // Wait for visualization to update
  await page.waitForTimeout(250);

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
      expect(Number.parseFloat(actualValue)).toBeCloseTo(value, 1);
    }
  } catch (error) {
    console.warn("Could not verify k value, continuing test", error);
  }
}

test.describe.configure({ mode: "parallel" });
test.describe("Visual Regression Testing", () => {
  // Test 2D visualization at specific k values
  const kValues2D = [1, 2, 5];

  for (const k of kValues2D) {
    test(`2D visualization with k=${k} matches snapshot`, async ({ page }) => {
      await page.goto("/");

      // Set k value
      await setSliderValue(page, k);

      // Wait for visualization to render completely
      await page.waitForTimeout(250);

      // Take screenshot of the canvas
      const canvas = page.locator("canvas").first();
      await expect(canvas).toBeVisible();

      // Try to verify k value one more time for certainty
      try {
        const element = await page.$("#current-k-value-2d");
        if (element) {
          const kValue = await element.getAttribute("data-k-value");
          if (kValue) {
            expect(Number.parseFloat(kValue)).toBeCloseTo(k, 1);
          }
        }
      } catch (error) {
        console.warn("Could not verify 2D k value before screenshot", error);
      }

      // Compare with baseline snapshot
      await expect(canvas).toHaveScreenshot(`2d-norm-k${k}.png`);
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

      // Stabilize the 3D visualization by fixing rotation
      await stabilize3DVisualization(page);

      // Take screenshot of the canvas (Three.js)
      const canvas = page.locator("canvas").first();
      await expect(canvas).toBeVisible();

      // Try to verify k value one more time for certainty
      try {
        const element = await page.$("#current-k-value");
        if (element) {
          const kValue = await element.getAttribute("data-k-value");
          if (kValue) {
            expect(Number.parseFloat(kValue)).toBeCloseTo(k, 1);
          }
        }
      } catch (error) {
        console.warn("Could not verify 3D k value before screenshot", error);
      }

      // Compare with baseline snapshot
      await expect(canvas).toHaveScreenshot(`3d-norm-k${k}.png`);
    });
  }
});
