import { z } from 'zod';

export const UserUpdateField = z.object({
  field: z.union([z.literal('name'), z.literal('email'), z.literal('password')]),
  value: z.string(),
});

export type UserUpdateField = z.infer<typeof UserUpdateField>['field'];
