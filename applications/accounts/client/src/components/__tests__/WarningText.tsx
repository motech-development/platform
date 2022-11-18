import { act, render, RenderResult } from '@testing-library/react';
import WarningText from '../WarningText';

describe('WarningText', () => {
  it('should show no warning', () => {
    const { container } = render(
      <WarningText
        id="test"
        component="p"
        message="Test"
        placement="left"
        show={false}
        variant="p"
      >
        Hello world
      </WarningText>,
    );
    const icon = container.querySelector(
      'svg[data-icon="exclamation-triangle"]',
    );

    expect(icon).not.toBeInTheDocument();
  });

  describe('when aligned to the left', () => {
    let component: RenderResult;

    beforeEach(async () => {
      await act(async () => {
        component = render(
          <WarningText
            id="test"
            component="p"
            message="Test"
            placement="left"
            show
            variant="p"
          >
            Hello world
          </WarningText>,
        );

        await Promise.resolve();
      });
    });

    it('should show warning icon', () => {
      const { container } = component;
      const icon = container.querySelector(
        'svg[data-icon="exclamation-triangle"]',
      );

      expect(icon).toBeInTheDocument();
    });
  });

  describe('when aligned to the right', () => {
    let component: RenderResult;

    beforeEach(async () => {
      await act(async () => {
        component = render(
          <WarningText
            id="test"
            component="p"
            message="Test"
            placement="right"
            show
            variant="p"
          >
            Hello world
          </WarningText>,
        );

        await Promise.resolve();
      });
    });

    it('should show warning icon', async () => {
      const { container } = component;
      const icon = container.querySelector(
        'svg[data-icon="exclamation-triangle"]',
      );

      await Promise.resolve();

      expect(icon).toBeInTheDocument();
    });
  });
});
