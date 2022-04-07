export interface Trackers {
  readonly id: number;
  readonly url: string;

  fetch(): Promise<void>;
  isBugValid(): Promise<boolean>;
  createComment(content: string, isPrivate?: boolean): Promise<boolean>;
  changeStatus(newStatus: any): Promise<boolean>;
  setFlag(name: string, status: any): Promise<boolean>;
}
