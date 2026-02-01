import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

describe('ErrorMessage Component', () => {
  it('should not render when error is null', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message string', () => {
    render(<ErrorMessage error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render error message from error object', () => {
    render(<ErrorMessage error={{ message: 'API Error' }} />);
    expect(screen.getByText('API Error')).toBeInTheDocument();
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
