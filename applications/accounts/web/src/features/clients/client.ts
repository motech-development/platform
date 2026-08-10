import { z } from 'zod';
import {
  contactDetailsSchema,
  postalAddressSchema,
  requiredTextSchema,
} from '../entity-details';

export const clientDetailsSchema = z.object({
  address: postalAddressSchema,
  companyId: z.string().min(1),
  contact: contactDetailsSchema,
  id: z.string(),
  name: requiredTextSchema('Client name is required'),
});

export type ClientDetails = z.output<typeof clientDetailsSchema>;
