import { z } from 'zod';

const postcodePattern =
  /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}\d[ABD-HJLN-UW-Z]{2}|GIR 0AA)$/;
// Keep this identical to the AppSync validator in
// applications/accounts/api/mapping-templates/shared/telephone/Pipeline.telephone.req.vtl.
const telephonePattern =
  /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|#)\d+)?)$/; // NOSONAR -- Exact copy of the authoritative AppSync validator; splitting it would risk client/API drift.

export const requiredTextSchema = (message: string) =>
  z.string().trim().min(1, message);

function isValidUkTelephone(value: string) {
  return telephonePattern.test(value.trim());
}

export const postalAddressSchema = z.object({
  line1: requiredTextSchema('Address line 1 is required'),
  line2: z.string(),
  line3: requiredTextSchema('Town or city is required'),
  line4: z.string(),
  line5: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(
      requiredTextSchema('Postcode is required').regex(
        postcodePattern,
        'Enter a valid UK postcode',
      ),
    ),
});

export const contactDetailsSchema = z.object({
  email: requiredTextSchema('Email address is required').pipe(
    z.email('Enter a valid email address'),
  ),
  telephone: requiredTextSchema('Telephone number is required').refine(
    isValidUkTelephone,
    'Enter a valid UK telephone number',
  ),
});

export function sortNamedEntities<T extends { name: string }>(
  entities: readonly T[],
): T[] {
  return [...entities].sort((left, right) =>
    left.name.localeCompare(right.name, 'en-GB', { sensitivity: 'base' }),
  );
}

export function exactEntityNameSchema(entityName: string) {
  return z.string().refine((value) => value === entityName, {
    message: `Enter ${entityName} exactly`,
  });
}
