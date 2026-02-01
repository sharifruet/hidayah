import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../../components/common/Loading.jsx';

describe('Loading Component', () => {
  it('should render loading spinner', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display custom message', () => {
    render(<Loading message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should have spinner element', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
