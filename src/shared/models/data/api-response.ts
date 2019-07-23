export class ApiResponse<T> {
  public data: T;
  public error: boolean;
}

export class ApiResponse2<T> {
  public Data: T;
  public IsSuccess: boolean;
}
