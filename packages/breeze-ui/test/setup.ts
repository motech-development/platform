import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Every render, including renderBreeze, mounts under StrictMode so effects run twice.
configure({ reactStrictMode: true });

afterEach(cleanup);
