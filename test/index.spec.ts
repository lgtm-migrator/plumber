// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock

import nock from 'nock';

import Plumber from '../src';
import { Probot, ProbotOctokit } from 'probot';

// interface Fixtures {
//     [key: string]: [key: string];
//  }

// const fixtures: Fixtures = {
//     issueOpened: require('./fixtures/issues.opened.json'),
//     pullrequestOpened: require('./fixtures/pullrequest.opened.json'),
//     pullrequestLabeled: require('./fixtures/pullrequest.labeled.json')
// };

import fs from 'fs';
import path from 'path';

// const owner = `jamacku`;
// const repo = `ultimate-probot`;

const privateKey = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-cert.pem'),
  'utf-8'
);

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(expectedObject: Object): R;
    }
  }
}

// nock.recorder.rec();

describe('Plumber app', () => {
  // let probot: any;

  // beforeEach(() => {
  //   nock.disableNetConnect();
  //   probot = new Probot({
  //     appId: 144917,
  //     privateKey,
  //     // disable request throttling and retries for testing
  //     Octokit: ProbotOctokit.defaults({
  //       retry: { enabled: false },
  //       throttle: { enabled: false },
  //     }),
  //   });

  //   probot.load(Plumber);
  // });

  /* Custom matcher
   * https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98 */
  // expect.extend({
  //   toContainObject(received, expectedObject: Object) {
  //     const pass = this.equals(
  //       received,
  //       expect.arrayContaining([expect.objectContaining(expectedObject)])
  //     );

  //     if (pass) {
  //       return {
  //         message: () =>
  //           `expected ${this.utils.printReceived(
  //             received
  //           )} not to contain object ${this.utils.printExpected(
  //             expectedObject
  //           )}`,
  //         pass: true,
  //       };
  //     } else {
  //       return {
  //         message: () =>
  //           `expected ${this.utils.printReceived(
  //             received
  //           )} to contain object ${this.utils.printExpected(expectedObject)}`,
  //         pass: false,
  //       };
  //     }
  //   },
  // });

  // ! FIX THIS ! //
  // test('add label when PR was labeled', async (done) => {
  //     const issueLabeledName = { name: 'ci-waived' };
  //     const payload = fixtures.pullrequestLabeled;

  //     const mock = nock('https://api.github.com')
  //         // Test that we correctly return a test token
  //         .post('/app/installations/2/access_tokens')
  //         .reply(200, {
  //             token: 'test',
  //             permissions: { issues: 'write' }
  //         })
  //         // Test label was set
  //         .post(`/repos/${owner}/${repo}/issues/1/labels`, (body: any) => {
  //             done(expect(body).toContainObject(issueLabeledName));
  //             return true;
  //         })
  //         .reply(200);

  //     // Receive a webhook event
  //     await probot.receive({ name: 'issues', payload });

  //     expect(mock.pendingMocks()).toStrictEqual([]);
  // });

  it.todo('renames PR topic to include bz number');

  it.todo('sets needs-ci label');

  it.todo('sets needs-review label');

  it.todo('sets needs-bz label');

  it.todo('sets needs-acks label');

  it.todo('sets z-stream label');

  it.todo('merges only approved and correctly labeled PRs');

  // afterEach(() => {
  //   nock.cleanAll();
  //   nock.enableNetConnect();
  // });
});
