// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock

import nock from 'nock';

import Plumber from '../src';
import { Probot, ProbotOctokit } from 'probot';

const fixtures = {
    issueOpened: require('./fixtures/issues.opened.json'),
    pullrequestOpened: require('./fixtures/pullrequest.opened.json'),
    pullrequestLabeled: require('./fixtures/pullrequest.labeled.json')
};

import fs from 'fs';
import path from 'path';

const owner = `jamacku`;
const repo = `ultimate-probot`;

const privateKey = fs.readFileSync(
    path.join(__dirname, 'fixtures/mock-cert.pem'),
    'utf-8'
);

describe('Plumber app', () => {
    let probot: any;

    beforeEach(() => {
        nock.disableNetConnect();
        probot = new Probot({
            appId: 123,
            privateKey,
            // disable request throttling and retries for testing
            Octokit: ProbotOctokit.defaults({
                retry: { enabled: false },
                throttle: { enabled: false }
            }),
        });

        probot.load(Plumber);
    });

    test('creates a comment when an issue is opened', async (done) => {
        const issueCreatedBody = { body: 'Thanks for opening this issue!' };
        const payload = fixtures.issueOpened;

        const mock = nock('https://api.github.com')
        // Test that we correctly return a test token
        .post('/app/installations/2/access_tokens')
        .reply(200, {
            token: 'test',
            permissions: {
            issues: 'write',
            },
        })
        // Test that a comment is posted
        .post(`/repos/${owner}/${repo}/issues/1/comments`, (body: any) => {
            done(expect(body).toMatchObject(issueCreatedBody));
            return true;
        })
        .reply(200);

        // Receive a webhook event
        await probot.receive({ name: 'issues', payload });

        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    // test('add label when PR was labeled', async (done) => {
    //     const payload = fixtures.pullrequestLabeled;
    //     const issueLabeledName = { name: 'ci-waived' };

    //     const mock = nock('https://api.github.com')
    //     // Test that we correctly return a test token
    //     .post('/app/installations/2/access_tokens')
    //     .reply(200, {
    //         token: 'test',
    //         permissions: {
    //         issues: 'write',
    //         },
    //     })
    //     // Test label was set
    //     .post(`/repos/${owner}/${repo}/issues/1/labels`, (body: any) => {
    //         done(expect(body).toMatchObject(issueLabeledName));
    //         return true;
    //     })
    //     .reply(200);

    //     // Receive a webhook event
    //     await probot.receive({ name: 'issues', payload });

    //     expect(mock.pendingMocks()).toStrictEqual([]);
    // });

    test('renames PR topic to include bz number', async () => {
        // TODO
        expect(true);
    });

    test('sets needs-ci label', async () => {
        // TODO
        expect(true);
    });

    test('sets needs-review label', async () => {
        // TODO
        expect(true);
    });

    test('sets needs-bz label', async () => {
        // TODO
        expect(true);
    });

    test('sets needs-acks label', async () => {
        // TODO
        expect(true);
    });

    test('sets z-stream label', async () => {
        // TODO
        expect(true);
    });

    test('merges only approved and correctly labeled PRs', async () => {
        // TODO
        expect(true);
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});