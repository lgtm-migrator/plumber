import { Endpoints } from '@octokit/types';

export type ListReviews =
  Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['response']['data'];
