import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '../pages/Home.jsx';
import PrayerTimes from '../pages/PrayerTimes.jsx';
import Calendar from '../pages/Calendar.jsx';
import { AppProvider } from '../context/AppContext.jsx';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {component}
        </AppProvider>
      </QueryClientProvider>
    );
  };

  it('should render Home page without errors', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container).toBeTruthy();
  });

  it('should render Prayer Times page without errors', () => {
    const { container } = renderWithProviders(<PrayerTimes />);
    expect(container).toBeTruthy();
  });

  it('should render Calendar page without errors', () => {
    const { container } = renderWithProviders(<Calendar />);
    expect(container).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const { container } = renderWithProviders(<Home />);
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Check that h1 exists
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();

    // Check heading order (simplified check)
    headings.forEach((heading, index) => {
      if (index > 0) {
        const prevLevel = parseInt(headings[index - 1].tagName.charAt(1));
        const currentLevel = parseInt(heading.tagName.charAt(1));
        // Levels should not skip more than 1
        expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
      }
    });
  });

  it('should have proper form labels', () => {
    const { container } = renderWithProviders(<PrayerTimes />);
    const inputs = container.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.type !== 'hidden') {
        const id = input.id;
        const label = id ? container.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');

        // Input should have label, aria-label, or aria-labelledby
        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  });

  it('should have proper alt text for images', () => {
    const { container } = renderWithProviders(<Home />);
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      // Alt should be present (can be empty for decorative images)
      expect(alt).not.toBeNull();
    });
  });

  it('should have proper button labels', () => {
    const { container } = renderWithProviders(<Home />);
    const buttons = container.querySelectorAll('button');

    buttons.forEach(button => {
      const text = button.textContent.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const title = button.getAttribute('title');

      // Button should have accessible text
      expect(text || ariaLabel || title).toBeTruthy();
    });
  });

  it('should have proper color contrast', () => {
    // This is a simplified test - full contrast testing requires specialized tools
    const { container } = renderWithProviders(<Home />);
    const elements = container.querySelectorAll('*');

    // Check that elements have text color defined
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;

      // Basic check - both should be defined
      if (el.textContent.trim() && color !== 'rgba(0, 0, 0, 0)') {
        expect(color).toBeTruthy();
        expect(bgColor).toBeTruthy();
      }
    });
  });

  it('should be keyboard navigable', () => {
    const { container } = renderWithProviders(<Home />);
    const interactiveElements = container.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );

    interactiveElements.forEach(el => {
      const tabIndex = el.getAttribute('tabindex');
      // Elements should be focusable (tabindex >= 0 or default)
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
