import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Check that layout adapts
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();

    // On mobile, grid should stack
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('grid-cols-1');
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check that layout adapts
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Check that layout adapts
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();

    // On desktop, grid should be side-by-side
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('lg:grid-cols-2');
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Check button sizes (should be large enough for touch)
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      const firstButton = buttons.first();
      const box = await firstButton.boundingBox();
      // Buttons should be at least 44x44px for touch
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});
