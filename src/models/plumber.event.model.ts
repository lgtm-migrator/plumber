import type { EmitterWebhookEventName } from "@octokit/webhooks";

export interface PlumberEvent {
  [key: string]: Array<EmitterWebhookEventName>
}
