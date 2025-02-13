'use client';

import {
  type Environments,
  type Paddle,
  initializePaddle,
} from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { keys } from './keys';

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();

  if (!keys().NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
    throw new Error('Paddle client token is required');
  }

  useEffect(() => {
    initializePaddle({
      environment: keys().NEXT_PUBLIC_PADDLE_ENV as Environments,
      token: keys().NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
      checkout: {
        settings: {
          variant: 'one-page',
        },
      },
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  return paddle;
}
