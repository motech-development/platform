import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import useCollectionEmptyContent from './useCollectionEmptyContent';

interface EmptyContentProbeProps {
  emptyContent?: ReactNode;
}

function EmptyContentProbe({ emptyContent }: EmptyContentProbeProps) {
  return <>{useCollectionEmptyContent(emptyContent)}</>;
}

describe('useCollectionEmptyContent', () => {
  it('uses the provider message unless contextual content is supplied', () => {
    renderBreeze(<EmptyContentProbe />, {
      messages: { noResults: 'Aucun résultat' },
    });
    renderBreeze(<EmptyContentProbe emptyContent="No matching accounts" />);

    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
    expect(screen.getByText('No matching accounts')).toBeInTheDocument();
  });

  it('preserves an explicit null empty state', () => {
    const { container } = renderBreeze(
      <EmptyContentProbe emptyContent={null} />,
    );

    expect(container).not.toHaveTextContent('No results');
  });
});
