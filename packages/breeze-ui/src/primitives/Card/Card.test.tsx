import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Card } from './Card';

describe('Card', () => {
  it('renders complete semantic card anatomy and forwards the root ref', () => {
    const ref = createRef<HTMLElement>();

    renderBreeze(
      <Card.Root aria-labelledby="card-title" ref={ref}>
        <Card.Header>
          <Card.Title id="card-title">Quarterly summary</Card.Title>
          <Card.Description>Updated today</Card.Description>
        </Card.Header>
        <Card.Body>Summary content</Card.Body>
        <Card.Footer>Supporting action</Card.Footer>
      </Card.Root>,
    );

    const card = screen.getByRole('article', { name: 'Quarterly summary' });

    expect(ref.current).toBe(card);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Quarterly summary',
    );
    expect(card).toHaveTextContent('Updated today');
    expect(card).toHaveTextContent('Summary content');
    expect(card).toHaveTextContent('Supporting action');
  });
});
