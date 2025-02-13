import { env } from '@/env';
import { analytics } from '@repo/analytics/posthog/server';
import { clerkClient } from '@repo/auth/server';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import {
  type CustomerCreatedEvent,
  type CustomerUpdatedEvent,
  type SubscriptionCreatedEvent,
  type SubscriptionUpdatedEvent,
  paddle,
} from '@repo/payments';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const getUserFromCustomerId = async (customerId: string) => {
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList();

  const user = users.data.find(
    (user) => user.privateMetadata.paddleCustomerId === customerId
  );

  return user;
};

const handleSubscriptionUpdate = async (
  data: SubscriptionCreatedEvent | SubscriptionUpdatedEvent
) => {
  if (!data.data.customerId) {
    return;
  }

  const customerId = data.data.customerId;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics.capture({
    event: 'User Subscribed',
    distinctId: user.id,
  });
};

const handleCustomerUpdate = async (
  data: CustomerCreatedEvent | CustomerUpdatedEvent
) => {
  if (!data.data.id) {
    return;
  }

  const customerId = data.data.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics.capture({
    event: 'User Subscribed',
    distinctId: user.id,
  });
};

export const POST = async (request: Request): Promise<Response> => {
  if (!env.PADDLE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Not configured', ok: false });
  }

  try {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('paddle-signature');

    if (!signature) {
      throw new Error('missing paddle-signature header');
    }

    const event = await paddle.webhooks.unmarshal(
      body,
      env.PADDLE_WEBHOOK_SECRET,
      signature
    );

    switch (event.eventType) {
      case 'subscription.created':
      case 'subscription.updated': {
        await handleSubscriptionUpdate(event);
        break;
      }
      case 'customer.created':
      case 'customer.updated': {
        await handleCustomerUpdate(event);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.eventType}`);
      }
    }

    await analytics.shutdown();

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    const message = parseError(error);

    log.error(message);

    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      { status: 500 }
    );
  }
};
