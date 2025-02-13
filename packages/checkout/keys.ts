import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_PADDLE_ENV: z.string().min(1).optional(),
      NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z.string().min(1).optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_PADDLE_ENV: process.env.NEXT_PUBLIC_PADDLE_ENV,
      NEXT_PUBLIC_PADDLE_CLIENT_TOKEN:
        process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    },
  });
