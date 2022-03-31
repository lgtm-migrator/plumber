import { Issue } from '../../src/models/issue.model';
import { IssueObject } from '../../src/types/issue';

describe('Issue Object', () => {
  let issue: Issue[];

  beforeEach(() => {
    const data: IssueObject[] = [
      {
        id: 1,
        title: '(#123456) An Issue 1',
        body: 'Testing Issue 1',
        labels: ['test-label', 'test-label-2', 'to-be-removed'],
      },
      {
        id: 1,
        title: 'An Issue 2',
        body: 'Testing Issue 2',
        labels: [],
      },
      {
        id: 1,
        title: '(#123456) An Issue 3',
        body: 'Testing Issue 3',
      },
    ];

    issue = data.map(item => new Issue(item));
  });

  it('can be instantiated', () => {
    issue.map(item => expect(item).toBeDefined());
  });

  it('can add label', () => {
    const testLabel = 'test-label';

    issue.map(item => {
      item.label = testLabel;
      expect(item.labels?.includes(testLabel)).toBeTruthy();
      expect(item.labels.filter(label => label === testLabel).length).toEqual(
        1
      );
    });
  });

  it.todo('can remove labels');
});
