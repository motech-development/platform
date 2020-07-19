import { render } from '@testing-library/react';
import React from 'react';
import TransactionDetailsCell from '../TransactionDetailsCell';

describe('TransactionDetailsCell', () => {
  it('should set width on xs viewport', async () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { findByText } = render(
      <table>
        <tbody>
          <tr>
            <TransactionDetailsCell>Test</TransactionDetailsCell>
          </tr>
        </tbody>
      </table>,
    );

    await expect(findByText('Test')).resolves.toHaveStyle(`
      max-width: 300px;
      min-width: 300px;
      width: 300px;
    `);
  });

  it('should set width on sm viewport', async () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query === '(min-width: 576px)',
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { findByText } = render(
      <table>
        <tbody>
          <tr>
            <TransactionDetailsCell>Test</TransactionDetailsCell>
          </tr>
        </tbody>
      </table>,
    );

    await expect(findByText('Test')).resolves.toHaveStyle(`
      max-width: 300px;
      min-width: 300px;
      width: 300px;
    `);
  });

  it('should not set width on other viewports', async () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query === '(min-width: 768px)',
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { findByText } = render(
      <table>
        <tbody>
          <tr>
            <TransactionDetailsCell>Test</TransactionDetailsCell>
          </tr>
        </tbody>
      </table>,
    );

    await expect(findByText('Test')).resolves.not.toHaveStyle(`
      max-width: 300px;
      min-width: 300px;
      width: 300px;
    `);
  });
});
