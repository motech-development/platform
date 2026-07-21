import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { NavigationList } from '../../primitives/NavigationList/NavigationList';
import { NavigationSection } from './NavigationSection';

describe('NavigationSection', () => {
  it('groups destinations under a visible landmark heading', () => {
    renderBreeze(
      <NavigationSection title="Records">
        <NavigationList.Root aria-label="Record destinations">
          <NavigationList.Item href="/records" id="records">
            Records
          </NavigationList.Item>
        </NavigationList.Root>
      </NavigationSection>,
    );

    expect(screen.getByRole('navigation', { name: 'Records' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Records' })).toBeVisible();
  });
});
