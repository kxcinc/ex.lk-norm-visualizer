import { test, expect } from "@playwright/test";

test.describe("Export Functionality", () => {
  test("should have export buttons visible in 2D visualization", async ({ page }) => {
    await page.goto("/");

    // Verify both export buttons are present
    const pngButton = page.locator("button", { hasText: "Export PNG" });
    const svgButton = page.locator("button", { hasText: "Export SVG" });
    
    await expect(pngButton).toBeVisible();
    await expect(svgButton).toBeVisible();
  });

  test("should have export button visible in 3D visualization", async ({ page }) => {
    await page.goto("/");
    
    // Switch to 3D tab
    await page.locator("button").filter({ hasText: "R3 Visualization" }).click();
    
    // Verify export button is present
    const pngButton = page.locator("button", { hasText: "Export PNG" });
    await expect(pngButton).toBeVisible();
  });

  test("should trigger download when export PNG is clicked in 2D view", async ({ page }) => {
    await page.goto("/");
    
    // Setup download listener with longer timeout
    const downloadPromise = page.waitForEvent("download", { timeout: 10000 });
    
    // Click the export PNG button
    await page.locator("button", { hasText: "Export PNG" }).click();
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify filename format
    expect(download.suggestedFilename()).toMatch(/lk_norm_.*_visualization\.png/);
  });

  test("should trigger download when export SVG is clicked in 2D view", async ({ page }) => {
    await page.goto("/");
    
    // Setup download listener with longer timeout
    const downloadPromise = page.waitForEvent("download", { timeout: 10000 });
    
    // Click the export SVG button
    await page.locator("button", { hasText: "Export SVG" }).click();
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify filename format
    expect(download.suggestedFilename()).toMatch(/lk_norm_.*_visualization\.svg/);
  });
});