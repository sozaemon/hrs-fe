import { HttpErrorResponse } from "@angular/common/http";

export const resolveHttpErrorMessage = (e: any): string => {
  let message = "unknown error";

  if (e instanceof Error) {
    message = e.message;
  } else if (e instanceof HttpErrorResponse) {
    const errorBody = e.error
    if ("message" in errorBody) {
      message = errorBody.message;
    }

    if ("data" in errorBody && typeof errorBody.data === "string") {
      message = errorBody.data;
    }
  }

  return message;
}