import 'server-only';
import { type Environment, Paddle } from '@paddle/paddle-node-sdk';
import { keys } from './keys';

export const paddle = new Paddle(keys().PADDLE_SECRET_KEY, {
  environment: keys().PADDLE_ENV as Environment,
});

export * from '@paddle/paddle-node-sdk';
