import { Component } from '@angular/core';
import { HomePage } from './home/home';
import { EntitiesPage } from './entities/entities';
import { BillingPage } from './billing/billing';
import { ProfilePage } from './profile/profile';
import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tab1Root = HomePage;
  public tab2Root = EntitiesPage;
  public tab3Root = BillingPage;
  public tab4Root = ProfilePage;

  constructor(private appStateService: AppStateServiceProvider) {}

  public getTabHiddenStatus(): boolean {
    return this.appStateService.getTabHiddenStatus();
  }

  public tabChanged(event: any) {
    event.setRoot(event.root);
  }
}
