import { Issue } from '../../src/models/issue.model';
import { IssueObject } from '../../src/types/issue';

describe('Issue Object', () => {
  let issue: Issue[];

  beforeEach(() => {
    const data: IssueObject[] = [
      {
        id: 1,
        title: {
          name: '(#123456) An Issue 1',
        },
        body: 'Testing Issue 1',
        labels: ['test-label', 'test-label-2', 'to-be-removed'],
      },
      {
        id: 1,
        title: {
          name: 'An Issue 2',
          bugRef: 123456,
        },
        body: 'Testing Issue 2',
        labels: [],
      },
      {
        id: 1,
        title: {
          name: '(#123456) An Issue 3',
          bugRef: 654321,
        },
        body: 'Testing Issue 3',
        labels: [],
      },
    ];

    issue = data.map(item => new Issue(item));
  });

  it('can be instantiated', () => {
    issue.map(item => expect(item).toBeDefined());
  });

  it('can correctly decompose title', () => {
    const expectedTitles = ['An Issue 1', 'An Issue 2', 'An Issue 3'];
    const expectedBugRefs = [123456, NaN, 123456];

    issue.map((item, index) =>
      expect(item.title).toEqual({
        name: expectedTitles[index],
        bugRef: expectedBugRefs[index],
      })
    );
  });

  it.todo('can add labels');

  it.todo('can remove labels');
});
