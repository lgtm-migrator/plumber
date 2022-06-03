import { Commit } from '../../pull-request/commits/commit/commit.model';
import { Flags, TrackerInterface } from '../../tracker/tracker';
import { Sections } from './message';

export class Message {
  private _sections: Map<keyof Sections, Sections[keyof Sections]> = new Map();

  constructor() {}

  private setSection(key: keyof Sections, value: Sections[keyof Sections]) {
    this._sections.set(key, value);
  }

  private getSection(key: keyof Sections) {
    return this._sections.get(key);
  }

  private getSectionString(key: keyof Sections) {
    const section = this.getSection(key);

    if (!section) return '';

    return (
      this.composeSection(section.title, '\n---\n\n') +
      this.composeSection(section.body, '\n\n---\n\n') +
      this.composeSection(`_${section.note}_`, '\n')
    );
  }

  private composeSection(value: string | undefined | null, divider = '') {
    return value ? value + divider : '';
  }

  get toString() {
    if (this.getSectionString('general') !== '') {
      return this.getSectionString('general');
    }

    return (
      this.getSectionString('config') +
      this.getSectionString('commits') +
      this.getSectionString('upstream') +
      this.getSectionString('flags') +
      this.getSectionString('ci') +
      this.getSectionString('reviews')
    );
  }

  isEmpty() {
    return this.toString === '';
  }

  clearSection(key: keyof Sections) {
    this.setSection(key, { title: '' });
  }

  setConfigTemplate(
    items: {
      property: string;
      value: string;
      notes?: { [type: string]: string };
    }[]
  ) {
    if (items.length < 1) {
      return;
    }

    this.setSection('config', {
      title: '⚠️ *Error when parsing configuration!* ⚠️',
      body: `${this.configTemplate(items)}`,
      note: 'For more information please visit 📖[wiki](https://github.com/jamacku/plumber/wiki/Configuration).',
    });
  }

  setCommitsTemplate(commits: Commit[]) {
    this.setSection('commits', {
      title: '⚠️ *Following commits are missing proper bugzilla reference!* ⚠️',
      body: `${this.commitsTemplate(commits)}`,
      note: 'Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.',
    });
  }

  setUpstreamTemplate(commits: Commit[]) {
    this.setSection('upstream', {
      title:
        '⚠️ *Following commits are missing upstream reference or RHEL-only note!* ⚠️',
      body: `${this.commitsTemplate(commits)}`,
      note: 'Please ensure that all commit messages include i.e.: _(cherry picked from commit abcd)_ or _RHEL-only_ if they are exclusive to RHEL. Otherwise they need to be proposed on [systemd](https://github.com/systemd/systemd) upstream first.',
    });
  }

  setFlagsTemplate(data: { flags: Partial<Flags>; bug: TrackerInterface }) {
    this.setSection('flags', {
      title: `⚠️ *Referenced ${data.bug.tracker} [#${data.bug.id}](${data.bug.url}) isn't approved* ⚠️`,
      body: `   
- [${data.flags.develAck?.approved ? 'x' : ' '}] \`${
        data.flags.develAck?.name
      }\`
- [${data.flags.qaAck?.approved ? 'x' : ' '}] \`${data.flags.qaAck?.name}\`
- [${data.flags.release?.approved ? 'x' : ' '}] \`${
        data.flags.release?.name
      }\``,
    });
  }

  setCITemplate() {
    this.setSection('ci', { title: '⚠️ *CI needs review* ⚠️' });
  }

  setCodeReviewTemplate() {
    this.setSection('reviews', { title: '⚠️ *Code review is required* ⚠️' });
  }

  setLgtmTemplate(bug: TrackerInterface) {
    this.setSection('general', {
      title: '👍 *LGTM* 👍',
      body: `
- [x] Commit messages in correct form
- [x] Referenced bug - [#${bug.id}](${bug.url})
- [x] All required flags granted
- [x] PR was reviewed`,
    });
  }

  private commitsTemplate(commits: Commit[]) {
    return commits
      .map(commit => {
        let slicedMsg = commit.message.split(/\n/, 1)[0].slice(0, 70);
        const dotDot = '...';

        return slicedMsg.length < 70
          ? `\`\`${slicedMsg}\`\` - ${commit.sha}`
          : `\`\`${slicedMsg}${dotDot}\`\` - ${commit.sha}`;
      })
      .join('\r\n');
  }

  private configTemplate(
    items: {
      property: string;
      value: string;
      notes?: { [type: string]: string };
    }[]
  ) {
    return items
      .map(
        item =>
          `\`${item.property}: ${item.value}\` - *${Object.keys(item.notes!)
            .map(key => `${item.notes![key]}`)
            .join(' | ')}*`
      )
      .join('\r\n');
  }
}
