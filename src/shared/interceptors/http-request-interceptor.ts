import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LoginPage } from '../../pages/login/login';
import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { Page } from '../models/app-state/page';
import { GraphQLError } from '../models/data/graphql-error';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private graphQLService: GraphqlServiceProvider,
    private appStateService: AppStateServiceProvider,
    private authService: AuthServiceProvider) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const operationName = req.body && req.body.operationName ? req.body.operationName : '';
    const useExistingToken = operationName.includes('RefreshToken') || operationName.includes('RevokeToken');
    return from(this.authService.getAuthFields(useExistingToken)) // make sure we're always getting the latest token
      .pipe(
        switchMap(authFields => {
          const clonedRequest = authFields && (authFields.token || operationName.includes('CheckUser')) && 
            !operationName.includes('API2')
            ? req.clone({
                headers: req.headers 
                  .set('token', authFields && authFields.token ? authFields.token : '')})
            : req.clone({
                headers: req.headers
                  .set('API-Key', environment.apiKey)
            });
            return next.handle(clonedRequest)
              .pipe(
                switchMap((result: HttpResponse<any>) => {
                  if (result && result.body && result.body.errors) {
                    throw result;
                  }
                  return of(result);
                }),
                catchError(
                  (error: any, caught: Observable<HttpEvent<any>>) => {
                    if ((error && error.error && error.error.errors && error.error.errors.length)
                      || (error && error.body && error.body.errors)) {
                      const errors = error.body ? error.body.errors : error.error.errors as GraphQLError[];
                      if (errors.some(e => e.extensions.code === "UNAUTHENTICATED") && 
                        this.appStateService.getPage() !== Page.Login &&
                        this.appStateService.getPage() !== Page.Splash &&
                        this.appStateService.getPage() !== Page.Registration &&
                        this.appStateService.getPage() !== Page.PasswordChange) {
                        return from(this.handleAuthError(errors));
                      } else if (!errors.some(e => e.extensions.code === "UNAUTHENTICATED")) {
                        this.graphQLService.sendErrorReport(errors[0].message, JSON.stringify(error));
                      }
                    } else {
                      if (error.message) {
                        this.graphQLService.sendErrorReport("Application Error", 
                          JSON.stringify({ message: error.message, stack: error.stack }));  
                      } else {
                        this.graphQLService.sendErrorReport("Application Error", 
                          JSON.stringify(error));
                      }
                    }
                    
                    return of(error);
                  }
                )
              );
        })
      );
  }

  private handleAuthError(errors: GraphQLError[]): Promise<any> {
    return this.authService.logout()
      .then(() => {
        this.appStateService.setRoot(LoginPage);
        return errors;
      });
  }
}
