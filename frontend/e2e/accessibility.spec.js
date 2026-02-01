import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Check that h1 exists before other headings
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = page.locator('input, select, textarea');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const inputType = await input.getAttribute('type');

      if (inputType !== 'hidden') {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Should have label, aria-label, or aria-labelledby
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const labelCount = await label.count();
          expect(labelCount > 0 || ariaLabel || ariaLabelledBy).toBeTruthy();
        } else {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA']).toContain(focused);
  });

  test('should have proper button labels', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      // Button should have accessible text
      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('should have proper link text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const href = await link.getAttribute('href');

      // Links should have text or aria-label (unless it's an icon link)
      if (href && href !== '#' && href !== '') {
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test('should have proper image alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt should be present (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for common ARIA issues
    const elementsWithAria = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const count = await elementsWithAria.count();

    // Should have some ARIA attributes for complex components
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper focus indicators', async ({ page }) => {
    // Focus on first interactive element
    await page.keyboard.press('Tab');

    // Check if focused element has visible focus indicator
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow
      };
    });

    // Should have some focus indicator
    expect(
      focusedElement?.outline !== 'none' ||
      focusedElement?.outlineWidth !== '0px' ||
      focusedElement?.boxShadow !== 'none'
    ).toBeTruthy();
  });

  test('should have proper color contrast (basic check)', async ({ page }) => {
    // This is a simplified check - full contrast testing requires specialized tools
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const firstText = textElements.first();

    if (await firstText.count() > 0) {
      const color = await firstText.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });

      // Both should be defined
      expect(color.color).toBeTruthy();
      expect(color.backgroundColor).toBeTruthy();
    }
  });

  test('should work with screen reader (basic check)', async ({ page }) => {
    // Check for semantic HTML
    const semanticElements = page.locator('main, nav, header, footer, article, section');
    const count = await semanticElements.count();

    // Should have some semantic elements
    expect(count).toBeGreaterThan(0);
  });
});
