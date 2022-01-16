import { Bug } from '../../src/models/bug.model';

import { BugObject } from '../../src/types/bug';

describe('Bug Object', () => {
  it('can be instantiated', () => {
    const bugData: BugObject = {
      id: 1,
    };

    const bug = new Bug(bugData);

    expect(bug).toBeDefined();
  });
});
