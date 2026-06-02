export type ErrorResponse<T> = {
  success: false;
  data: T;
  error: {
    message: string;
    stack: string;
  };
};

export type SuccessResponse<T, TOther = {}> = {
  success: true;
  data: T;
} & TOther;
