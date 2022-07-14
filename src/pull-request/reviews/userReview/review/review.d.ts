import { AuthorAssociation } from '@octokit/webhooks-types';

export interface ReviewObject {
  id: number;
  user: string | undefined;
  authorAssociation: AuthorAssociation;
  body?: string;
  state: string;
  submittedAt: string | undefined;
}
