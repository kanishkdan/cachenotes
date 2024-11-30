export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public type?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}