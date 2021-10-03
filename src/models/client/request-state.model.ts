export interface RequestState<T> {
  loading: boolean;
  data?: T;
  error?: unknown;
}
