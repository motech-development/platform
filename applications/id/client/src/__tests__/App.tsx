import { render } from '@testing-library/react';
import App from '../App';
import TestProvider from '../utils/TestProvider';

describe('App', () => {
  it('should show the name of the app in the bar', async () => {
    const { findByText } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    await expect(findByText('app-name')).resolves.toBeInTheDocument();
  });
});
