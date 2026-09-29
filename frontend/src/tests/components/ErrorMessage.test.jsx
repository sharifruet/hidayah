import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

describe('ErrorMessage Component', () => {
  it('should not render when error is null', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message string', () => {
    render(<ErrorMessage error="Custom failure text" />);
    expect(screen.getByText('Custom failure text')).toBeInTheDocument();
  });

  it('should map an API error object to a friendly message (never the raw server text)', () => {
    render(<ErrorMessage error={{ message: 'ER_NO_SUCH_TABLE', status: 500 }} />);
    expect(screen.queryByText('ER_NO_SUCH_TABLE')).not.toBeInTheDocument();
    expect(screen.getByText(/temporarily unavailable/)).toBeInTheDocument();
  });

  it('should show a network message for NETWORK_ERROR', () => {
    render(<ErrorMessage error={{ message: 'Network error', code: 'NETWORK_ERROR', status: 0 }} />);
    expect(screen.getByText(/No internet connection/)).toBeInTheDocument();
  });

  it('should display retry button when onRetry is provided', () => {
    const onRetry = () => {};
    render(<ErrorMessage error="Error" onRetry={onRetry} />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('should not display retry button when onRetry is not provided', () => {
    render(<ErrorMessage error="Error" />);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });
});
