/* eslint-disable import/no-extraneous-dependencies */
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { ReactElement } from 'react';
import { Sizing, Themes } from './tailwind';

export const themes = [
  {
    theme: Themes.DANGER,
  },
  {
    theme: Themes.PRIMARY,
  },
  {
    theme: Themes.SECONDARY,
  },
  {
    theme: Themes.SUCCESS,
  },
  {
    theme: Themes.WARNING,
  },
];

export const sizing = [
  {
    size: Sizing.LG,
  },
  {
    size: Sizing.MD,
  },
  {
    size: Sizing.NONE,
  },
  {
    size: Sizing.SM,
  },
];

type TSetup = RenderResult & {
  user: UserEvent;
};

/**
 * Combines Testing Library render function with user events setup
 *
 * @param ui - React element to test
 *
 * @returns Rendered component and test user
 */
export function setup(ui: ReactElement): TSetup {
  return {
    user: userEvent.setup({
      delay: null,
    }),
    ...render(ui),
  };
}
