import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import InputWrapper from './InputWrapper';
import Tooltip from '../Tooltip/Tooltip';

describe('InputWrapper', () => {
  let component: RenderResult;

  describe('with no error', () => {
    beforeEach(() => {
      component = render(
        <InputWrapper
          spacing="lg"
          error={false}
          tooltip={() => (
            <Tooltip
              id="test"
              parent={() => <div data-testid="alert" />}
              colour="danger"
              placement="left"
              message={null}
            />
          )}
        >
          <input type="test" data-testid="input" />
        </InputWrapper>,
      );
    });

    it('should render with the correct styles', () => {
      const { container } = component;

      expect(container.firstChild).toHaveStyle('border-bottom-color: #eee;');
    });

    it('should render an input', () => {
      const { getByTestId } = component;

      expect(getByTestId('input')).toBeDefined();
    });
  });

  describe('with an error', () => {
    beforeEach(() => {
      component = render(
        <InputWrapper
          spacing="md"
          error
          tooltip={() => (
            <Tooltip
              id="test"
              parent={() => <div data-testid="alert" />}
              colour="danger"
              placement="left"
              message="This is a test error"
            />
          )}
        >
          <input type="test" data-testid="input" />
        </InputWrapper>,
      );
    });

    it('should render when the correct styles when there is an error', () => {
      const { container } = component;

      expect(container.firstChild).toHaveStyle(
        'border-bottom-color: rgb(199,56,79);',
      );
    });

    it('should display the alert icon', () => {
      const { getByTestId } = component;

      expect(getByTestId('alert')).toBeDefined();
    });
  });
});
