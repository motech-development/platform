import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { FormattedList } from './FormattedList';

describe('FormattedList', () => {
  it('uses conjunction and long style by default', () => {
    renderBreeze(<FormattedList values={['PDF', 'JPG', 'PNG']} />, {
      locale: 'en-GB',
    });

    expect(screen.getByText('PDF, JPG and PNG')).toBeVisible();
  });

  it('renders empty and single-item values without separators', () => {
    renderBreeze(
      <>
        <FormattedList data-testid="empty" values={[]} />
        <FormattedList data-testid="single" values={['PDF']} />
      </>,
      { locale: 'en-GB' },
    );

    expect(screen.getByTestId('empty')).toBeEmptyDOMElement();
    expect(screen.getByTestId('single')).toHaveTextContent('PDF');
  });

  it.each([
    [{ type: 'disjunction' }, 'PDF, JPG or PNG'],
    [{ style: 'short' }, 'PDF, JPG and PNG'],
    [{ style: 'narrow' }, 'PDF, JPG, PNG'],
  ] as const)('applies Intl options %o', (options, expected) => {
    renderBreeze(
      <FormattedList options={options} values={['PDF', 'JPG', 'PNG']} />,
      { locale: 'en-GB' },
    );

    expect(screen.getByText(expected)).toBeVisible();
  });
});
