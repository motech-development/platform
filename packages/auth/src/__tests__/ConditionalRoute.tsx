import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ConditionalRoute from '../ConditionalRoute';

function TestComponent() {
  return <p data-testid="success">Success</p>;
}

function RedirectComponent() {
  return <p data-testid="fail">Fail</p>;
}

describe('ConditionalRoute', () => {
  let condition: boolean;

  it('should display route when condition is met', async () => {
    condition = true;

    const { findByTestId } = render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ConditionalRoute
                condition={condition}
                element={<TestComponent />}
                redirect="/fail"
              />
            }
          />
          <Route path="/fail" element={<RedirectComponent />} />
        </Routes>
      </MemoryRouter>,
    );

    await expect(findByTestId('success')).resolves.toBeInTheDocument();
  });

  it('should redirect away when condition is not met', async () => {
    condition = false;

    const { findByTestId } = render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ConditionalRoute condition={condition} redirect="/fail">
                <TestComponent />
              </ConditionalRoute>
            }
          />
          <Route path="/fail" element={<RedirectComponent />} />
        </Routes>
      </MemoryRouter>,
    );

    await expect(findByTestId('fail')).resolves.toBeInTheDocument();
  });
});
