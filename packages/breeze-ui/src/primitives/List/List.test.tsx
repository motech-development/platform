import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { List } from './List';

describe('List', () => {
  it('renders unordered and ordered native list semantics', () => {
    const ref = createRef<HTMLOListElement>();
    const { unmount } = renderBreeze(
      <List.Root aria-label="Requirements">
        <List.Item>Keyboard accessible</List.Item>
        <List.Item>Responsive</List.Item>
      </List.Root>,
    );

    expect(screen.getByRole('list', { name: 'Requirements' }).tagName).toBe(
      'UL',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    unmount();
    renderBreeze(
      <List.Root aria-label="Steps" ordered ref={ref}>
        <List.Item>Review</List.Item>
        <List.Item>Publish</List.Item>
      </List.Root>,
    );

    expect(screen.getByRole('list', { name: 'Steps' }).tagName).toBe('OL');
    expect(ref.current).toBe(screen.getByRole('list', { name: 'Steps' }));
  });
});
