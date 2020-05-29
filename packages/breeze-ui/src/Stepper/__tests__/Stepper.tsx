import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import Stepper from '../Stepper';

describe('Stepper', () => {
  let component: RenderResult;

  describe('with compulsory props', () => {
    beforeEach(() => {
      component = render(
        <Stepper previousLabel="Prev" nextLabel="Next">
          <div data-testid="step-1">Step</div>

          <div data-testid="step-2">Step</div>

          <div data-testid="step-3">Step</div>
        </Stepper>,
      );
    });

    it('should display the previous button and should be disabled', async () => {
      const { findAllByRole } = component;
      const [button] = await findAllByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Prev');
      expect(button).toHaveAttribute('disabled');
    });

    it('should display the next button', async () => {
      const { findAllByRole } = component;
      const [, button] = await findAllByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Next');
    });

    it('should display the first step', async () => {
      const { findAllByText, findByTestId } = component;

      await expect(findByTestId('step-1')).resolves.toBeInTheDocument();
      await expect(findAllByText('Step')).resolves.toHaveLength(1);
    });

    it('should display the last step and the next button should not be visible', async () => {
      const {
        findAllByRole,
        findAllByText,
        findByTestId,
        queryByText,
      } = component;
      const [, button] = await findAllByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      await expect(findByTestId('step-3')).resolves.toBeInTheDocument();
      await expect(findAllByText('Step')).resolves.toHaveLength(1);
      expect(queryByText('Next')).not.toBeInTheDocument();
    });
  });

  describe('with a custom on complete button', () => {
    beforeEach(() => {
      component = render(
        <Stepper
          previousLabel="Prev"
          nextLabel="Next"
          onComplete={
            <button type="button" data-testid="custom-button">
              Complete
            </button>
          }
        >
          <div data-testid="step-1">Step</div>

          <div data-testid="step-2">Step</div>
        </Stepper>,
      );
    });

    it('should display custom on complete button', async () => {
      const { findAllByRole, findByTestId } = component;
      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      await expect(findByTestId('custom-button')).resolves.toBeInTheDocument();
    });
  });

  describe('with a custom on start button', () => {
    beforeEach(() => {
      component = render(
        <Stepper
          previousLabel="Prev"
          nextLabel="Next"
          onStart={
            <button type="button" data-testid="custom-button">
              Start
            </button>
          }
        >
          <div data-testid="step-1">Step</div>

          <div data-testid="step-2">Step</div>
        </Stepper>,
      );
    });

    it('should display custom on start button', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('custom-button')).resolves.toBeInTheDocument();
    });

    it('should show usual back button', async () => {
      const { findAllByRole, findByText, queryByTestId } = component;
      const [, button] = await findAllByRole('button');

      fireEvent.click(button);

      expect(queryByTestId('custom-button')).not.toBeInTheDocument();

      await expect(findByText('Prev')).resolves.toBeInTheDocument();
    });
  });

  describe('with custom logic to enable the next button', () => {
    beforeEach(() => {
      component = render(
        <Stepper
          previousLabel="Prev"
          nextLabel="Next"
          enableNext={step => step !== 0}
        >
          <div data-testid="step-1">Step</div>

          <div data-testid="step-2">Step</div>

          <div data-testid="step-3">Step</div>
        </Stepper>,
      );
    });

    it('should disable the next button', async () => {
      const { findAllByRole } = component;
      const [, button] = await findAllByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('when the start point has be set', () => {
    beforeEach(() => {
      component = render(
        <Stepper previousLabel="Prev" nextLabel="Next" start={1}>
          <div data-testid="step-1">Step</div>

          <div data-testid="step-2">Step</div>

          <div data-testid="step-3">Step</div>
        </Stepper>,
      );
    });

    it('should display the second step', async () => {
      const { findAllByText, findByTestId } = component;

      await expect(findByTestId('step-2')).resolves.toBeInTheDocument();
      await expect(findAllByText('Step')).resolves.toHaveLength(1);
    });

    it('should go back to the first step', async () => {
      const { findAllByRole, findAllByText, findByTestId } = component;
      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await expect(findByTestId('step-1')).resolves.toBeInTheDocument();
      await expect(findAllByText('Step')).resolves.toHaveLength(1);
    });
  });
});
