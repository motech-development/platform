import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { DescriptionList } from './DescriptionList';

describe('DescriptionList', () => {
  it('preserves native term-description relationships and forwards refs', () => {
    const ref = createRef<HTMLDListElement>();

    const { container } = renderBreeze(
      <DescriptionList.Root ref={ref}>
        <DescriptionList.Item>
          <DescriptionList.Term>Status</DescriptionList.Term>
          <DescriptionList.Description>Active</DescriptionList.Description>
        </DescriptionList.Item>
        <DescriptionList.Item>
          <DescriptionList.Term>Owner</DescriptionList.Term>
          <DescriptionList.Description>Alex</DescriptionList.Description>
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );

    expect(ref.current).toBe(container.querySelector('dl'));
    expect(screen.getByText('Status').tagName).toBe('DT');
    expect(screen.getByText('Active').tagName).toBe('DD');
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
  });
});
