import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renders card with all subcomponents', () => {
    render(
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content</p>
        </CardContent>
        <CardFooter>
          <button>Footer</button>
        </CardFooter>
      </Card>
    );

    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('card-title');

    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();

    const footer = screen.getByText('Footer');
    expect(footer).toBeInTheDocument();
  });

  it('applies additional classNames', () => {
     const { container } = render(<Card className="extra-class">Content</Card>);
     expect(container.firstChild).toHaveClass('card');
     expect(container.firstChild).toHaveClass('extra-class');
  });
});
