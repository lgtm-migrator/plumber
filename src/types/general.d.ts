import { Feedback } from '../models/feedback.model';

export interface Validation<T> {
  validate(instance: T): Feedback;
}
