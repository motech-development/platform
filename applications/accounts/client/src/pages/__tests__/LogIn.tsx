import { fireEvent, render } from '@testing-library/react';
import TestProvider, { loginWithRedirect } from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  it('should call loginWithRedirect with the correct params', async () => {
    loginWithRedirect.mockResolvedValue(null);

    const { findByRole } = render(
      <TestProvider>
        <LogIn />
      </TestProvider>,
    );

    const button = await findByRole('button');

    fireEvent.click(button);

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        returnTo: '/my-companies',
      },
    });
  });
});
