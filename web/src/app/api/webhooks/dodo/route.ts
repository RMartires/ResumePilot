import { NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import type { WebhookPayload } from "@dodopayments/core";
import {
  grantProFromPayment,
  markReferralConversionCancelled,
  readUserId,
  recordBillingEvent,
  revokeProAccess,
  syncSubscriptionFromWebhook,
} from "@/lib/billing/sync";

const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

function eventDedupKey(payload: WebhookPayload): string {
  const data = payload.data as Record<string, unknown>;
  const paymentId = typeof data.payment_id === "string" ? data.payment_id : null;
  const subscriptionId =
    typeof data.subscription_id === "string" ? data.subscription_id : null;

  if (paymentId) {
    return `${payload.type}:${paymentId}`;
  }
  if (subscriptionId) {
    return `${payload.type}:${subscriptionId}`;
  }

  return payload.type;
}

async function handleOnce(
  payload: WebhookPayload,
  handler: () => Promise<void>,
): Promise<void> {
  const eventId = eventDedupKey(payload);
  const isNew = await recordBillingEvent(eventId, payload.type, payload);
  if (!isNew) {
    return;
  }
  await handler();
}

export const POST = webhookKey
  ? Webhooks({
      webhookKey,
      onPaymentSucceeded: async (payload) => {
        await handleOnce(payload, async () => {
          await grantProFromPayment(payload.data);
        });
      },
      onPaymentFailed: async (payload) => {
        await handleOnce(payload, async () => {
          const paymentId = payload.data.payment_id;
          if (paymentId) {
            await markReferralConversionCancelled(paymentId);
          }
        });
      },
      onSubscriptionActive: async (payload) => {
        await handleOnce(payload, async () => {
          await syncSubscriptionFromWebhook(payload.data);
        });
      },
      onSubscriptionUpdated: async (payload) => {
        await handleOnce(payload, async () => {
          await syncSubscriptionFromWebhook(payload.data);
        });
      },
      onSubscriptionRenewed: async (payload) => {
        await handleOnce(payload, async () => {
          await syncSubscriptionFromWebhook(payload.data);
        });
      },
      onSubscriptionOnHold: async (payload) => {
        await handleOnce(payload, async () => {
          await syncSubscriptionFromWebhook({
            ...payload.data,
            status: "on_hold",
          });
        });
      },
      onSubscriptionCancelled: async (payload) => {
        await handleOnce(payload, async () => {
          const userId = await syncSubscriptionFromWebhook({
            ...payload.data,
            status: "cancelled",
          });

          if (!userId) {
            return;
          }

          const cancelAtPeriodEnd = Boolean(
            payload.data.cancel_at_next_billing_date,
          );
          const periodEnd = payload.data.next_billing_date;
          const periodStillActive =
            periodEnd instanceof Date
              ? periodEnd.getTime() > Date.now()
              : typeof periodEnd === "string"
                ? new Date(periodEnd).getTime() > Date.now()
                : false;

          if (!cancelAtPeriodEnd || !periodStillActive) {
            await revokeProAccess(userId);
          }
        });
      },
      onSubscriptionFailed: async (payload) => {
        await handleOnce(payload, async () => {
          const userId = readUserId(payload.data);
          if (userId) {
            await revokeProAccess(userId);
          }
        });
      },
      onSubscriptionExpired: async (payload) => {
        await handleOnce(payload, async () => {
          const userId = await syncSubscriptionFromWebhook({
            ...payload.data,
            status: "expired",
          });
          if (userId) {
            await revokeProAccess(userId);
          }
        });
      },
      onRefundSucceeded: async (payload) => {
        await handleOnce(payload, async () => {
          const paymentId = payload.data.payment_id;
          if (paymentId) {
            await markReferralConversionCancelled(paymentId);
          }
        });
      },
    })
  : async () =>
      NextResponse.json(
        { error: "DODO_PAYMENTS_WEBHOOK_KEY is not configured" },
        { status: 503 },
      );
