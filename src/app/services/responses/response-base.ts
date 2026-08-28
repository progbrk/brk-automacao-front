export interface ResponseBase<T> {
  success: boolean;
  message: string | null;
  data: T;
}
