import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('marks the final breadcrumb current and routes preceding links', async () => {
    const navigate = vi.fn();
    const user = userEvent.setup();

    renderBreeze(
      <Breadcrumbs.Root aria-label="Breadcrumb">
        <Breadcrumbs.Item href="/projects" id="projects">
          Projects
        </Breadcrumbs.Item>
        <Breadcrumbs.Item id={2}>Breeze</Breadcrumbs.Item>
      </Breadcrumbs.Root>,
      { router: { navigate } },
    );
    await user.click(screen.getByRole('link', { name: 'Projects' }));

    expect(navigate).toHaveBeenCalledWith('/projects');
    expect(screen.getByText('Breeze')).toHaveAttribute('aria-current', 'page');
  });
});
