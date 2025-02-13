import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      PADDLE_SECRET_KEY: z.string().min(1),
      PADDLE_WEBHOOK_SECRET: z.string().min(1).startsWith('ntfset_').optional(),
      PADDLE_ENV: z.string().min(1).optional(),
    },
    runtimeEnv: {
      PADDLE_SECRET_KEY: process.env.PADDLE_SECRET_KEY,
      PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET,
      PADDLE_ENV: process.env.PADDLE_ENV,
    },
  });
