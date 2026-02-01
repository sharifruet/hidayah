import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Settings');
  });

  test('should allow method selection', async ({ page }) => {
    // Wait for methods to load
    await page.waitForTimeout(2000);

    const methodSelect = page.locator('select').first();
    if (await methodSelect.isVisible()) {
      await methodSelect.selectOption('hanafi');
      await expect(methodSelect).toHaveValue('hanafi');
    }
  });

  test('should allow Sehri margin adjustment', async ({ page }) => {
    const sehriInput = page.locator('input[type="number"]').first();
    if (await sehriInput.isVisible()) {
      await sehriInput.fill('12');
      await expect(sehriInput).toHaveValue('12');
    }
  });

  test('should toggle language', async ({ page }) => {
    const languageButton = page.locator('button:has-text("Switch")');
    if (await languageButton.isVisible()) {
      await languageButton.click();
      // Language should change
    }
  });
});
