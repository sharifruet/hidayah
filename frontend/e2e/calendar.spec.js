import { test, expect } from '@playwright/test';

test.describe('Calendar Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
  });

  test('should display calendar page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calendar');
  });

  test('should allow view type selection', async ({ page }) => {
    const viewTypeSelect = page.locator('select').first();
    await expect(viewTypeSelect).toBeVisible();

    // Select monthly view
    await viewTypeSelect.selectOption('monthly');
    await expect(viewTypeSelect).toHaveValue('monthly');

    // Select yearly view
    await viewTypeSelect.selectOption('yearly');
    await expect(viewTypeSelect).toHaveValue('yearly');

    // Select date range view
    await viewTypeSelect.selectOption('date-range');
    await expect(viewTypeSelect).toHaveValue('date-range');
  });

  test('should display monthly calendar controls', async ({ page }) => {
    const viewTypeSelect = page.locator('select').first();
    await viewTypeSelect.selectOption('monthly');

    // Check for year and month inputs
    const yearInput = page.locator('input[type="number"]').first();
    await expect(yearInput).toBeVisible();
  });

  test('should display export buttons', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(2000);

    // Check for export buttons
    const exportButtons = page.locator('button:has-text("Download")');
    const count = await exportButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow date range selection', async ({ page }) => {
    const viewTypeSelect = page.locator('select').first();
    await viewTypeSelect.selectOption('date-range');

    // Check for date inputs
    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs).toHaveCount(2);
  });
});
