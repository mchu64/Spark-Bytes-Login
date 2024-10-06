import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  server: {
    DATABASE_URL: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_USER: z.string().min(1),
    JWT_TOKEN_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
