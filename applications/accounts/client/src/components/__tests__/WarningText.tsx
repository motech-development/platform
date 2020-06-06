import { act, render, RenderResult } from '@testing-library/react';
import React from 'react';
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
    const arrow = container.querySelector(
      'svg[data-icon="exclamation-triangle"]',
    );

    expect(arrow).not.toBeInTheDocument();
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
      });
    });

    it('should show warning arrow', () => {
      const { container } = component;
      const arrow = container.querySelector(
        'svg[data-icon="exclamation-triangle"]',
      );

      expect(arrow).toBeInTheDocument();
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
      });
    });

    it('should show warning arrow', async () => {
      const { container } = component;
      const arrow = container.querySelector(
        'svg[data-icon="exclamation-triangle"]',
      );

      expect(arrow).toBeInTheDocument();
    });
  });
});
