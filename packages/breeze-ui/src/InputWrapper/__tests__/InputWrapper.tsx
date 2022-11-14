import { act, render, RenderResult, waitFor } from '@testing-library/react';
import InputWrapper from '../InputWrapper';

describe('InputWrapper', () => {
  let component: RenderResult;

  describe('with no error', () => {
    beforeEach(() => {
      component = render(
        <InputWrapper error={false} message="" name="test" spacing="lg">
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
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <InputWrapper
            error
            spacing="md"
            name="test"
            message="This is a test error"
          >
            <input type="test" data-testid="input" />
          </InputWrapper>,
        );

        await Promise.resolve();
      });
    });

    it('should render when the correct styles when there is an error', async () => {
      const { container, findByRole } = component;

      await waitFor(() => findByRole('alert'));

      expect(container.firstChild).toHaveStyle(
        'border-bottom-color: rgb(199,56,79);',
      );
    });

    it('should display the alert icon', async () => {
      const { findByRole } = component;

      await expect(findByRole('alert')).resolves.toBeInTheDocument();
    });
  });

  describe('with help text', () => {
    beforeEach(() => {
      component = render(
        <InputWrapper
          error={false}
          helpText="This is help text"
          message=""
          name="test"
          spacing="lg"
        >
          <input type="test" data-testid="input" />
        </InputWrapper>,
      );
    });

    it('should render the help text', async () => {
      const { findByText } = component;

      await expect(
        findByText('This is help text'),
      ).resolves.toBeInTheDocument();
    });
  });
});
