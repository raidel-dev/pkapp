import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Pro } from '@ionic/pro';
import { IonicStorageModule } from '@ionic/storage';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { environment } from '../environments/environment';
import { LoginPageModule } from '../pages/login/login.module';
import { HomePageModule } from '../pages/tabs/home/home.module';
import { TabsPage } from '../pages/tabs/tabs';
import { AppStateServiceProvider } from '../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../providers/auth/auth-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { EmojiProvider } from '../providers/chat-service/emoji';
import { GraphqlServiceProvider } from '../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../providers/helper/helper-service';
import { HttpRequestInterceptor } from '../shared/interceptors/http-request-interceptor';
import { SharedModule } from '../shared/shared.module';
import { MyApp } from './app.component';
import { Badge } from '@ionic-native/badge';
import { BackgroundMode } from '@ionic-native/background-mode';

Pro.init('7baccffc', {
  appVersion: '0.1.0'
});

@NgModule({
  imports: [
    SharedModule,
    HomePageModule,
    LoginPageModule,
    ApolloModule,
    HttpLinkModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: true,
      autoFocusAssist: true
    }),
    IonicStorageModule.forRoot({
      name: '__pkdb',
      driverOrder: ['indexeddb', 'websql']
    })
  ],
  declarations: [
    MyApp,
    TabsPage
  ],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ChatServiceProvider,
    AuthServiceProvider,
    HelperServiceProvider,
    AppStateServiceProvider,
    ChatServiceProvider,
    EmojiProvider,
    Badge,
    BackgroundMode,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache({
            addTypename: false
          }),
          link: httpLink.create({
            uri: environment.graphqlEndpoint
          })
        }
      },
      deps: [HttpLink]
    },
    GraphqlServiceProvider
  ],
  bootstrap: [IonicApp]
})
export class AppModule {

}
