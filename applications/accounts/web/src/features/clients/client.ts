import { z } from 'zod';
import { companyDetailsSchema } from '../companies/company';

const required = (message: string) => z.string().trim().min(1, message);

export const clientDetailsSchema = z.object({
  address: companyDetailsSchema.shape.address,
  companyId: z.string().min(1),
  contact: companyDetailsSchema.shape.contact,
  id: z.string(),
  name: required('Client name is required'),
});

export type ClientDetails = z.output<typeof clientDetailsSchema>;

export function sortClientsByName<T extends { name: string }>(
  clients: readonly T[],
): T[] {
  return [...clients].sort((left, right) =>
    left.name.localeCompare(right.name, 'en-GB', { sensitivity: 'base' }),
  );
}

export function exactClientNameSchema(clientName: string) {
  return z.string().refine((value) => value === clientName, {
    message: `Enter ${clientName} exactly`,
  });
}
