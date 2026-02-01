import { test, expect } from '@playwright/test';

test.describe('Prayer Times Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prayer-times');
  });

  test('should display prayer times page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Prayer Times');
    await expect(page.locator('text=Select a location')).toBeVisible();
  });

  test('should allow date selection', async ({ page }) => {
    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();

    // Set a date
    await dateInput.fill('2024-03-15');
    await expect(dateInput).toHaveValue('2024-03-15');
  });

  test('should display map for location selection', async ({ page }) => {
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();
  });

  test('should display prayer times card', async ({ page }) => {
    // Wait for prayer times to load
    await page.waitForTimeout(2000);

    // Check for prayer time labels
    await expect(page.locator('text=Fajr')).toBeVisible();
    await expect(page.locator('text=Dhuhr')).toBeVisible();
    await expect(page.locator('text=Maghrib')).toBeVisible();
  });

  test('should allow method selection', async ({ page }) => {
    // Wait for component to load
    await page.waitForTimeout(2000);

    // Look for method selector (if present)
    const methodSelect = page.locator('select').first();
    if (await methodSelect.isVisible()) {
      await methodSelect.selectOption('hanafi');
    }
  });
});
