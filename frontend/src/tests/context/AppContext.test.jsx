import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from '../../context/AppContext.jsx';

// Test component that uses the context
function TestComponent() {
  const { location, method, updateLocation, updateMethod } = useApp();

  return (
    <div>
      <div data-testid="location">{location.name || 'Unknown'}</div>
      <div data-testid="method">{method}</div>
      <button
        data-testid="update-location"
        onClick={() => updateLocation({ lat: 24.0, lng: 90.0, name: 'Test Location' })}
      >
        Update Location
      </button>
      <button
        data-testid="update-method"
        onClick={() => updateMethod('hanafi')}
      >
        Update Method
      </button>
    </div>
  );
}

describe('AppContext', () => {
  it('should provide default values', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('Dhaka');
    expect(screen.getByTestId('method')).toHaveTextContent('karachi');
  });

  it('should update location', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const updateButton = screen.getByTestId('update-location');
    act(() => {
      updateButton.click();
    });

    expect(screen.getByTestId('location')).toHaveTextContent('Test Location');
  });

  it('should update method', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const updateButton = screen.getByTestId('update-method');
    act(() => {
      updateButton.click();
    });

    expect(screen.getByTestId('method')).toHaveTextContent('hanafi');
  });
});
