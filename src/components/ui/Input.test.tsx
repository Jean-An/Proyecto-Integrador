import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
  });

  it('handles text input', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('Hello'); // Note: Input needs to be controlled or handle internal state for this check if generic
  });
  
  // For standard HTML inputs, simply firing change doesn't update "value" prop if controlled,
  // but if it's uncontrolled or we just check the event call, that's fine.
  // Let's assume standard behavior for custom Input component.

  it('applies className prop', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
