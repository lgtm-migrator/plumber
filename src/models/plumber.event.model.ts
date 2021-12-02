import type { EmitterWebhookEventName } from '@octokit/webhooks';

export interface PlumberEvent {
  init: Array<EmitterWebhookEventName>;
  checksCompleted: Array<EmitterWebhookEventName>;
  checksInProgress: Array<EmitterWebhookEventName>;
  reviews: Array<EmitterWebhookEventName>;
  labels: Array<EmitterWebhookEventName>;
  edited: Array<EmitterWebhookEventName>;
  [key: string]: Array<EmitterWebhookEventName>;
}
