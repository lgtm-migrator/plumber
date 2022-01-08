import type { EmitterWebhookEventName } from '@octokit/webhooks';

export interface PlumberEvent {
  init: EmitterWebhookEventName[];
  checksCompleted: EmitterWebhookEventName[];
  checksInProgress: EmitterWebhookEventName[];
  reviews: EmitterWebhookEventName[];
  labels: EmitterWebhookEventName[];
  edited: EmitterWebhookEventName[];
  [key: string]: EmitterWebhookEventName[];
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
