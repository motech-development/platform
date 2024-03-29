import { act, fireEvent, render } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  let button: HTMLElement;
  let tooltip: HTMLElement;

  describe('in production', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should render', async () => {
      const { findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      await expect(findByTestId('button')).resolves.toBeInTheDocument();
    });
  });

  describe('visibility', () => {
    it('should hide after 1000ms', async () => {
      const { findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      jest.useFakeTimers();

      jest.spyOn(global, 'setTimeout');

      fireEvent.blur(button);

      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });

    it('should hide the tooltip', async () => {
      jest.useFakeTimers();

      const { findByTestId, queryByRole } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      expect(queryByRole('tooltip')).toBeDefined();

      fireEvent.blur(button);

      act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(queryByRole('tooltip')).toBeNull();
    });
  });

  describe('primary', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: #007fa8;
        color: #fff;
      `);
    });

    it('should display content', () => {
      const { textContent } = tooltip.firstChild as ChildNode;

      expect(textContent).toEqual('Hello');
    });
  });

  describe('danger', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="danger"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: rgb(199,56,79);
        color: #fff;
      `);
    });
  });

  describe('secondary', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="secondary"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: #f6f9fc;
        color: #333;
      `);
    });
  });

  describe('success', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
          colour="success"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should show the tooltip on hover', () => {
      expect(tooltip).toBeDefined();
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        background-color: rgb(0,128,93);
        color: #fff;
      `);
    });
  });

  describe('top', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="top"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #007fa8;
        bottom: -5px;
      `);
    });
  });

  describe('bottom', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="bottom"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid #007fa8;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        top: -5px;
      `);
    });
  });

  describe('left', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="left"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid transparent;
        border-left: 5px solid #007fa8;
        border-top: 5px solid transparent;
        right: -5px;
      `);
    });
  });

  describe('right', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="right"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        border-bottom: 5px solid transparent;
        border-right: 5px solid #007fa8;
        border-top: 5px solid transparent;
        left: -5px;
      `);
    });
  });

  describe('auto', () => {
    beforeEach(async () => {
      const { findByRole, findByTestId } = render(
        <Tooltip
          id="test"
          parent={
            <button type="button" data-testid="button">
              Hello world
            </button>
          }
          placement="auto"
          message="Hello"
        />,
      );

      button = await findByTestId('button');

      fireEvent.focus(button);

      tooltip = await findByRole('tooltip');
    });

    it('should have the correct styles', () => {
      expect(tooltip).toHaveStyle(`
        font-size: 14px;
        line-height: 22px;
        padding: 0 5px;
      `);
    });

    it('should have an arrow pointing the correct way', () => {
      expect(tooltip.firstElementChild).toHaveStyle(`
        height: 0;
        position: absolute;
        width: 0;
      `);
    });
  });
});
