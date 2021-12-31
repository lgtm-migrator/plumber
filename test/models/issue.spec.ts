import { Issue } from '../../src/models/issue.model';
import { IssueObject } from '../../src/types/issue';

describe('Issue Object', () => {
  it('can be instantiated', () => {
    const issue: IssueObject = {
      id: 1,
      title: {
        name: 'An Issue',
      },
      body: 'Testing PR',
    };

    const pr = new Issue(issue);

    expect(pr).toBeDefined();
  });
});
