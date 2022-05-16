export type FeedbackObject = {
  id?: number;
  message: Message;
};

export interface Validation<T> {
  validate(instance: T): Feedback;
}
