import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import type { Mock } from 'vitest';
import TestProvider from '../../utils/TestProvider';
import UserBar from '../UserBar';

describe('UserBar', () => {
  let component: RenderResult;
  let logOut: Mock;
  let name: string;
  let picture: string;

  beforeEach(() => {
    logOut = vi.fn();
    name = 'Mo';
    picture = 'https://avatar.photo';

    Object.defineProperty(window, 'matchMedia', {
      value: vi
        .fn<(query: string) => MediaQueryList>()
        .mockImplementation((query) => ({
          addEventListener: vi.fn(),
          addListener: vi.fn(),
          dispatchEvent: vi.fn(),
          matches: query === '(min-width: 992px)',
          media: query,
          onchange: null,
          removeEventListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      writable: true,
    });
  });

  describe('when no avatar is set', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <TestProvider>
            <UserBar name={name} notifications={<div />} logOut={logOut} />
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should log out', async () => {
      const { findByRole } = component;
      const button = await findByRole('button');

      fireEvent.click(button);

      expect(logOut).toHaveBeenCalled();
    });

    it('should display user name', async () => {
      const { findByText } = component;

      await expect(findByText('Mo')).resolves.toBeInTheDocument();
    });
  });

  describe('when an avatar is set', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <TestProvider>
            <UserBar
              name={name}
              picture={picture}
              notifications={<div />}
              logOut={logOut}
            />
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display a photo if set', async () => {
      const { findByRole } = component;

      await expect(findByRole('img')).resolves.toBeInTheDocument();
    });
  });
});
