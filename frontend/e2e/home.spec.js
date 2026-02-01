import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with map and prayer times', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Salat & Saom Timing');

    // Check map is visible
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();

    // Check prayer times card is visible
    await expect(page.locator('text=Prayer Times')).toBeVisible();
  });

  test('should allow location search', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search location"]');
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('Dhaka');

    // Wait for search results (if any)
    await page.waitForTimeout(1000);
  });

  test('should display prayer times after map click', async ({ page }) => {
    // Click on map (approximate center of Bangladesh)
    const map = page.locator('.leaflet-container');
    await map.click({ position: { x: 400, y: 300 } });

    // Wait for API call and prayer times to load
    await page.waitForTimeout(2000);

    // Check if prayer times are displayed
    const prayerTimes = page.locator('text=/\\d{2}:\\d{2}/');
    await expect(prayerTimes.first()).toBeVisible();
  });

  test('should navigate to prayer times page', async ({ page }) => {
    const prayerTimesLink = page.locator('a[href="/prayer-times"]');
    await prayerTimesLink.click();

    await expect(page).toHaveURL(/.*prayer-times/);
    await expect(page.locator('h1')).toContainText('Prayer Times');
  });

  test('should navigate to fasting times page', async ({ page }) => {
    const fastingTimesLink = page.locator('a[href="/fasting-times"]');
    await fastingTimesLink.click();

    await expect(page).toHaveURL(/.*fasting-times/);
    await expect(page.locator('h1')).toContainText('Fasting Times');
  });

  test('should navigate to calendar page', async ({ page }) => {
    const calendarLink = page.locator('a[href="/calendar"]');
    await calendarLink.click();

    await expect(page).toHaveURL(/.*calendar/);
    await expect(page.locator('h1')).toContainText('Calendar');
  });

  test('should toggle language', async ({ page }) => {
    const languageButton = page.locator('button:has-text("বাংলা")');
    await languageButton.click();

    // Check if Bengali text appears
    await expect(page.locator('text=সালাত')).toBeVisible();
  });
});
