import { ReviewObject } from '../types/review';

export class Review {
  private readonly _id: number;
  private _message: string;

  constructor(data: ReviewObject) {
    this._id = data.id;
    this._message = data.message;
  }

  get id() {
    return this._id;
  }

  get message() {
    return this._message;
  }

  set message(newMessage: string) {
    this._message = newMessage;
  }
}
