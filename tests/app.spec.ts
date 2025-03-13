import { test, expect } from "@playwright/test";

test.describe("Lk-Norm Visualizer", () => {
  test("should load the application with 2D visualization by default", async ({ page }) => {
    await page.goto("/");
    
    // Check title
    await expect(page.locator("h1")).toContainText("Lk-Norm Visualization");
    
    // Verify 2D visualization is selected by default
    const activeTab = page.locator("button.active");
    await expect(activeTab).toContainText("R2 Visualization");
    
    // Verify canvas is visible
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });
  
  test("should switch to 3D visualization when tab is clicked", async ({ page }) => {
    await page.goto("/");
    
    // Click on 3D tab
    await page.locator("button").filter({ hasText: "R3 Visualization" }).click();
    
    // Verify 3D tab is now active
    const activeTab = page.locator("button.active");
    await expect(activeTab).toContainText("R3 Visualization");
    
    // Verify 3D canvas is visible (might take a moment to load)
    await expect(page.locator("canvas")).toBeVisible();
  });
  
  test("should change k value when slider is adjusted", async ({ page }) => {
    await page.goto("/");
    
    // Get the initial k value
    const initialKText = await page.locator("label[for='k-value']").textContent();
    const initialK = initialKText ? Number.parseFloat(initialKText.split(":")[1].trim()) : 0;
    
    // Move slider to a new position
    const slider = page.locator("input[type='range']");
    await slider.evaluate((el: HTMLInputElement) => {
      el.value = "5.0";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    
    // Add a wait to give the browser time to update the UI
    await page.waitForTimeout(500);
    
    // Verify that the k value has changed from initial value (don't check for exact value)
    const newKText = await page.locator("label[for='k-value']").textContent();
    const newK = newKText ? Number.parseFloat(newKText.split(":")[1].trim()) : 0;
    expect(newK).not.toEqual(initialK);
  });
});