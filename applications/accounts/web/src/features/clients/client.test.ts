import { describe, expect, it } from 'vitest';
import { clientDetailsSchema, exactClientNameSchema } from './client';

const validClient = {
  address: {
    line1: '48 Lumen Street',
    line2: '',
    line3: 'Manchester',
    line4: '',
    line5: 'm1 2ab',
  },
  companyId: 'company-id',
  contact: {
    email: 'hello@northstar.studio',
    telephone: '020 7946 0182',
  },
  id: 'client-id',
  name: 'Northstar Studio',
};

describe('client details', () => {
  it('normalises an established client before mutation', () => {
    expect(clientDetailsSchema.parse(validClient)).toEqual({
      ...validClient,
      address: { ...validClient.address, line5: 'M1 2AB' },
    });
  });

  it('requires the exact case-sensitive client name for deletion', () => {
    const schema = exactClientNameSchema('Northstar Studio');

    expect(schema.safeParse('Northstar Studio').success).toBe(true);
    expect(schema.safeParse('northstar studio').success).toBe(false);
  });
});
