import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

configure({ reactStrictMode: true });

afterEach(cleanup);
