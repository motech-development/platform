import { z } from 'zod';
import {
  contactDetailsSchema,
  exactEntityNameSchema,
  postalAddressSchema,
  requiredTextSchema,
  sortNamedEntities,
} from '../entity-details';

export const clientDetailsSchema = z.object({
  address: postalAddressSchema,
  companyId: z.string().min(1),
  contact: contactDetailsSchema,
  id: z.string(),
  name: requiredTextSchema('Client name is required'),
});

export type ClientDetails = z.output<typeof clientDetailsSchema>;

export function sortClientsByName<T extends { name: string }>(
  clients: readonly T[],
): T[] {
  return sortNamedEntities(clients);
}

export function exactClientNameSchema(clientName: string) {
  return exactEntityNameSchema(clientName);
}
