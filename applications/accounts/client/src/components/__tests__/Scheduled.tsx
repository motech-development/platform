import { act, render, RenderResult } from '@testing-library/react';
import Scheduled from '../Scheduled';

describe('Scheduled', () => {
  let value: string;

  beforeEach(() => {
    value = new Date().toISOString();
  });

  it('should show no clock', () => {
    const { container } = render(
      <Scheduled
        id="test"
        message="Test"
        placement="left"
        show={false}
        value={value}
      />,
    );
    const icon = container.querySelector('svg[data-icon="clock"]');

    expect(icon).not.toBeInTheDocument();
  });

  describe('when aligned to the left', () => {
    let component: RenderResult;

    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Scheduled
            id="test"
            message="Test"
            placement="left"
            show
            value={value}
          />,
        );
      });
    });

    it('should show clock', () => {
      const { container } = component;
      const icon = container.querySelector('svg[data-icon="clock"]');

      expect(icon).toBeInTheDocument();
    });
  });

  describe('when aligned to the right', () => {
    let component: RenderResult;

    beforeEach(async () => {
      await act(async () => {
        component = render(
          <Scheduled
            format="dd/mm/yyyy"
            id="test"
            message="Test"
            placement="right"
            show
            value={value}
          />,
        );
      });
    });

    it('should show clock', async () => {
      const { container } = component;
      const icon = container.querySelector('svg[data-icon="clock"]');

      expect(icon).toBeInTheDocument();
    });
  });
});
