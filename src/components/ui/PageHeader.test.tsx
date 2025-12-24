import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title and description', () => {
    render(
      <PageHeader
        title="Page Title"
        description="Page Description"
      />
    );
    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByText('Page Description')).toBeInTheDocument();
  });

  it('renders action element if provided', () => {
    render(
      <PageHeader
        title="Page Title"
        description="Page Description"
        actionElement={<button>Action Button</button>}
      />
    );
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});
