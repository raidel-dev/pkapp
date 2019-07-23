import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';

import { Constants } from '../../shared/constants';
import { AuthFields } from '../../shared/models/auth/auth-fields';
import { GraphqlServiceProvider } from '../graphql/graphql-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthServiceProvider {

  public authFields: AuthFields;
  public authFieldsSetEvent: Subject<AuthFields> = new Subject();

  private jwtHelperService: JwtHelperService;
  private refreshTokenPromise: Promise<AuthFields>;

  constructor(public graphQLService: GraphqlServiceProvider, private storage: Storage) {
    this.jwtHelperService = new JwtHelperService();
  }

  public authenticate(username: string, password: string): Promise<boolean> {
    return this.graphQLService.authenticateUser(username, password, 'customer')
      .then(res => {
        if (res && res.data) {
          return this.setAuthFields(res.data.authenticateUser.token, res.data.authenticateUser.userID)
            .then(() => {
              return this.authFields && this.authFields.token !== null;
            });
        }

        return this.authFields && this.authFields.token !== null;
      })
      .catch(() => {
        return false;
      });
  }

  public setAuthFields(token: string, userID: string): Promise<any> {
    this.authFields = new AuthFields(token, userID);
    this.authFieldsSetEvent.next(this.authFields);

    return this.storage.set(Constants.storageKeys.authFields, this.authFields);
  }

  public getAuthFields(useExisingToken = false): Promise<AuthFields> {
    return this.storage.get(Constants.storageKeys.authFields)
      .then(data => {
        if (data && this.isExpired(data.token) && !useExisingToken) {
          if (this.refreshTokenPromise) {
            return this.refreshTokenPromise;
          } else {
            this.refreshTokenPromise = this.refreshToken();
            return this.refreshTokenPromise;
          }
        } else {
          if (this.refreshTokenPromise && !useExisingToken) {
            return this.refreshTokenPromise;
          } else {
            return data ? new AuthFields(data.token, data.userID) : new AuthFields();
          }
        }
      }, () => {
        return new AuthFields();
      });
  }

  public resetAuthFields(): void {
    this.storage.remove(Constants.storageKeys.authFields);
    this.authFields = null;
    this.refreshTokenPromise = null;
    this.authFieldsSetEvent.next(this.authFields);
  }

  public logout(): Promise<boolean> {
    return this.graphQLService.revokeToken()
      .then(() => {
        this.resetAuthFields();
        this.graphQLService.resetAll();
        return true;
      });
  }

  private isExpired(token: string): boolean {
    if (token === null || token === '') {
      return true;
    }

    let date = this.getTokenExpirationDate(token);
    if (date === null) {
      return true;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  private getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = this.jwtHelperService.decodeToken(token);

    if (!decoded.hasOwnProperty('expires')) {
      return null;
    }

    return new Date(decoded.expires);
  }

  private refreshToken(): Promise<AuthFields> {
    return this.graphQLService.refreshToken()
      .then(refreshResult => {
        if (this.authFields && this.authFields.userID) {
          const newAuthFields = new AuthFields(refreshResult.data.refreshToken.token, this.authFields.userID);
          return this.storage.set(Constants.storageKeys.authFields, newAuthFields)
            .then(() => {
              this.refreshTokenPromise = null;
              return newAuthFields;
            });
        } else {
          this.refreshTokenPromise = null;
          return new AuthFields();
        }
      })
      .catch(() => {
        this.refreshTokenPromise = null;
        return new AuthFields();
      });
  }
}
