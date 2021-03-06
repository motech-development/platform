import { render } from '@testing-library/react';
import { FC } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import ConditionalRoute from '../ConditionalRoute';

const TestComponent: FC = () => <p data-testid="success">Success</p>;

const RedirectComponent: FC = () => <p data-testid="fail">Fail</p>;

describe('ConditionalRoute', () => {
  let condition: boolean;

  it('should display route when condition is met', async () => {
    condition = true;

    const { findByTestId } = render(
      <MemoryRouter>
        <ConditionalRoute
          condition={condition}
          path="/"
          component={TestComponent}
          redirect="/fail"
        />
        <Route path="/fail" component={RedirectComponent} />
      </MemoryRouter>,
    );

    await expect(findByTestId('success')).resolves.toBeInTheDocument();
  });

  it('should redirect away when condition is not met', async () => {
    condition = false;

    const { findByTestId } = render(
      <MemoryRouter>
        <ConditionalRoute
          condition={condition}
          path="/"
          component={TestComponent}
          redirect="/fail"
        />
        <Route path="/fail" component={RedirectComponent} />
      </MemoryRouter>,
    );

    await expect(findByTestId('fail')).resolves.toBeInTheDocument();
  });
});
