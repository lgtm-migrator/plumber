import {
  IsBoolean,
  IsHash,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

import { CommitObject, BugRef } from './commit';

export class Commit {
  @IsHash('sha1')
  private readonly _sha: string;

  @IsString()
  private readonly _message: string;

  @IsString()
  private readonly _title?: string;

  @IsNumber()
  private readonly _bugRef: BugRef;

  @ValidateIf(commit => !commit._rhelOnly)
  @IsHash('sha1')
  private readonly _upstreamRef?: string;

  @ValidateIf(commit => !commit._upstreamRef)
  @IsBoolean()
  private readonly _rhelOnly?: boolean;

  constructor(data: CommitObject) {
    this._sha = data.sha;
    this._message = data.message;

    this._title = data?.title ?? this.getTitle(this.message);
    this._bugRef = data?.bugRef ?? this.getBugRef(this.message);
    this._upstreamRef = data?.upstreamRef ?? this.getUpstreamRef(this.message);
    this._rhelOnly = data?.rhelOnly ?? this.getRhelOnly(this.message);
  }

  get sha() {
    return this._sha;
  }

  get title() {
    return this._title;
  }

  get message() {
    return this._message;
  }

  get bugRef() {
    return this._bugRef;
  }

  get upstreamRef() {
    return this._upstreamRef;
  }

  get rhelOnly() {
    return this._rhelOnly;
  }

  private getTitle(message: string) {
    const TitleSize = 70;
    let slicedMsg = message.split(/\n/, 1)[0].slice(0, TitleSize);

    return slicedMsg.length < TitleSize ? slicedMsg : `${slicedMsg}...`;
  }

  private getBugRef(message: string) {
    const bugRegex = /(^\s*|\n|\\n)(Resolves|Related): ?#(\d+)$/;

    const bugRef = message.match(bugRegex);
    return Array.isArray(bugRef) ? +bugRef[3] : undefined;
  }

  private getUpstreamRef(message: string) {
    const upstreamRegex =
      /^\(cherry picked from commit (\b[0-9a-f]{5,40}\b)\)$/;

    const upstreamRef = message.match(upstreamRegex);
    return Array.isArray(upstreamRef) ? upstreamRef[1] : undefined;
  }

  private getRhelOnly(message: string) {
    const rhelOnlyRegex = /^RHEL-only$/;

    const rhelOnly = message.match(rhelOnlyRegex);
    return Array.isArray(rhelOnly) ? rhelOnly[0] !== '' : false;
  }
}
