import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { Keyboard, Platform } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AppStateServiceProvider } from '../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../providers/graphql/graphql-service';
import { Constants } from '../shared/constants';
import { Page } from '../shared/models/app-state/page';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any = LoginPage;

  constructor(platform: Platform,
    private backgroundMode: BackgroundMode,
    private authService: AuthServiceProvider,
    private appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private statusBar: StatusBar,
    private keyboard: Keyboard,
    private storage: Storage,
    private splashScreen: SplashScreen) {
    this.storage.remove(Constants.storageKeys.questionAnswers);
    this.storage.remove(Constants.storageKeys.isTosAccepted);
    platform.ready().then(() => {
      this.authService.getAuthFields()
        .then(authFields => {
          if (authFields.userID) {
            this.authService.setAuthFields(authFields.token, authFields.userID);
            this.appStateService.setPage(Page.Splash);
            this.graphQLService.checkUser(authFields.userID)
              .then(() => {
                this.setupPlatform();
                this.rootPage = TabsPage;
              })
              .catch(() => {
                this.setupPlatform();
              });
          } else {
            this.setupPlatform();
          }
        });
    });
  }

  private setupPlatform(): void {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#8ADB20');
    this.statusBar.backgroundColorByHexString('#0A2A51');
    this.keyboard.hideFormAccessoryBar(false);
    this.splashScreen.hide();
    this.backgroundMode.enable();
  }
}
