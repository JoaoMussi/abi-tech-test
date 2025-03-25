import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { catchError } from 'rxjs';

const errorMessages: Map<number, ToastMessageOptions> = new Map<
  number,
  ToastMessageOptions
>([
  [
    500,
    {
      severity: 'error',
      summary: 'Internal server error',
      detail:
        'Error occurred in the server while executing this operation. Please call support.',
    },
  ],
  [
    400,
    {
      severity: 'error',
      summary: 'Bad request',
      detail: 'Bad request created to the server!',
    },
  ],
  [
    404,
    {
      severity: 'error',
      summary: 'Not found!',
      detail: 'The resource requested to the server was not found.',
    },
  ],
]);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = errorMessages.get(error.status);
      messageService.add(errorMessage ?? errorMessages.get(500)!);
      throw error;
    })
  );
};
