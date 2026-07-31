/** Corpo padrão retornado pelo GlobalExceptionHandler do backend. */
export interface ApiErrorResponse {
  timestamp: string;
  message: string;
}

/** Envelope devolvido pelos endpoints paginados (Spring Data Page<T>, serialização direta). */
export interface PagedResponse<T> {
  content: T[];
  number: number; // página atual, 0-indexed
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
