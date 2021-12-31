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

export interface PlumberConfig {
  repository: string;
  requireReview?: boolean | number;
  rhel: number;
  branchPrefix?: string;
  labels?: {
    needsCi?: string;
    needsReview?: string;
    needsBz?: string;
    needsAcks?: string;
    dontMerge?: string;
    ciWaived?: string;
  };
}
