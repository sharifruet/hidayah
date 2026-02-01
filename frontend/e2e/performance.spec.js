import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load home page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`Home page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('should have good Lighthouse performance score', async ({ page }) => {
    await page.goto('/');

    // Basic performance check - full Lighthouse requires CI/CD integration
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    console.log('Performance metrics:', metrics);

    // First Contentful Paint should be under 1.8s (good)
    expect(metrics.firstContentfulPaint).toBeLessThan(1800);

    // DOM Content Loaded should be reasonable
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('should handle map rendering efficiently', async ({ page }) => {
    await page.goto('/');

    // Wait for map to load
    await page.waitForSelector('.leaflet-container', { timeout: 5000 });

    const mapLoadTime = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('leaflet') || r.name.includes('tile'))
        .reduce((max, r) => Math.max(max, r.responseEnd - r.startTime), 0);
    });

    console.log(`Map load time: ${mapLoadTime}ms`);
    expect(mapLoadTime).toBeLessThan(5000); // Map should load in under 5 seconds
  });

  test('should handle API calls efficiently', async ({ page }) => {
    await page.goto('/');

    // Wait for initial API calls
    await page.waitForLoadState('networkidle');

    const apiCalls = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('/v1/'))
        .map(r => ({
          url: r.name,
          duration: r.responseEnd - r.startTime,
          size: r.transferSize
        }));
    });

    console.log('API call metrics:', apiCalls);

    // Each API call should complete in reasonable time
    apiCalls.forEach(call => {
      expect(call.duration).toBeLessThan(2000); // Under 2 seconds per call
    });
  });

  test('should have optimized bundle size', async ({ page }) => {
    await page.goto('/');

    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.initiatorType === 'script' || r.initiatorType === 'link')
        .map(r => ({
          name: r.name,
          size: r.transferSize,
          duration: r.responseEnd - r.startTime
        }));
    });

    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const jsSize = resources
      .filter(r => r.name.includes('.js'))
      .reduce((sum, r) => sum + r.size, 0);

    console.log(`Total resource size: ${(totalSize / 1024).toFixed(2)}KB`);
    console.log(`JavaScript size: ${(jsSize / 1024).toFixed(2)}KB`);

    // JavaScript bundle should be reasonable (under 1MB for initial load)
    expect(jsSize).toBeLessThan(1024 * 1024);
  });

  test('should handle rapid navigation efficiently', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.click('a[href="/prayer-times"]');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="/fasting-times"]');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="/calendar"]');
    await page.waitForLoadState('networkidle');

    const totalTime = Date.now() - startTime;

    console.log(`Navigation time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(10000); // Should navigate quickly
  });

  test('should handle large calendar generation efficiently', async ({ page }) => {
    await page.goto('/calendar');

    // Select yearly view
    await page.selectOption('select', 'yearly');
    await page.waitForLoadState('networkidle');

    const calendarLoadTime = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('/calendar/yearly'))
        .reduce((max, r) => Math.max(max, r.responseEnd - r.startTime), 0);
    });

    console.log(`Yearly calendar load time: ${calendarLoadTime}ms`);
    expect(calendarLoadTime).toBeLessThan(5000); // Should load in under 5 seconds
  });
});
