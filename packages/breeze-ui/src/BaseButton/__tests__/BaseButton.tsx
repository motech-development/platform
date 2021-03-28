import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import BaseButton, { buttonTheme } from '../BaseButton';

describe('BaseButton', () => {
  it('should render default button', async () => {
    const { findByRole } = render(
      <ThemeProvider theme={buttonTheme}>
        <BaseButton>Hello</BaseButton>
      </ThemeProvider>,
    );

    await expect(findByRole('button')).resolves.toHaveStyle(`
      appearance: none;
      background-color: #007fa8;
      border: 0;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-family: 'Cabin',sans-serif;
      font-size: 16px;
      font-weight: 600;
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      position: relative;
      vertical-align: middle;
      text-align: center;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
    `);
  });
});
