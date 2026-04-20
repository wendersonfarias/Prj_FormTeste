import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const novaRequisicao = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(novaRequisicao).pipe(
    catchError((error: HttpErrorResponse) => {
      // se token expirou
      if (error.status === 401) {
        console.log('Token expirado, tentando renovar...');

        return authService.refreshToken().pipe(
          switchMap((res) => {
            // salva novos tokens
            authService.setTokens(res.access_token, res.refresh_token);

            // refaz requisição original
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access_token}`,
              },
            });

            return next(retryReq);
          }),

          //  se refresh falhar → logout
          catchError((err) => {
            authService.clearTokens();
            console.error('Refresh falhou, precisa logar novamente');
            return throwError(() => err);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
