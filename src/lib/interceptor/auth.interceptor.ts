import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {AuthService} from '../service/auth.service';

export interface AuthInterceptorConfig {
  apiBaseUri: string
}

export class AuthInterceptor implements HttpInterceptor {

  private static HTTP: string = 'HTTP'

  private readonly authInterceptorConfig: AuthInterceptorConfig;
  private readonly authService: AuthService;

  constructor(authInterceptorConfig: AuthInterceptorConfig, authService: AuthService) {
    this.authInterceptorConfig = authInterceptorConfig;
    this.authService = authService
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url
    if (url.startsWith(AuthInterceptor.HTTP)) {
      return throwError(() => new HttpErrorResponse({error: "Request cannot have it's base-uri", status: 400}))
    }

    req = req.clone({
      url: `${this.authInterceptorConfig.apiBaseUri}${url}`
    })

    return fromPromise(this.authService.getAuthToken()).pipe(
      switchMap((token: string | undefined): Observable<HttpEvent<any>> => {
        if (token) {
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        }

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              void this.authService.login()
              return this.throwUnauthorizedError()
            } else {
              return this.throwError(error)
            }
          })
        );
      })
    )
  }

  private throwUnauthorizedError(): Observable<HttpEvent<any>> {
    const error: HttpErrorResponse = new HttpErrorResponse({
      error: 'No token received after auth',
      status: 401,
      statusText: 'UNAUTHORIZED'
    })

    return this.throwError(error)
  }

  private throwError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    return throwError(() => new HttpErrorResponse({
      error: error.message,
      status: error.status,
      statusText: error.statusText
    }));
  }
}
