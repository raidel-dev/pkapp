import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { ItemSliding, NavController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { AppStateServiceProvider } from '../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { User } from '../../../shared/models//user/user';
import { Alert } from '../../../shared/models/alert/alert';
import { Page } from '../../../shared/models/app-state/page';
import { Ticket } from '../../../shared/models/ticket/ticket';
import { Badge } from '@ionic-native/badge';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  public selectedIndex = 0;

  public loading = true;
  public alerts: Alert[];
  public filterByContractID = true;
  public homeErrorMessage = '';

  private user: User;
  // private userID: string;
  // private gettingHomePageData = false;

  constructor(public navCtrl: NavController,
    private badge: Badge,
    private toastController: ToastController,
    private appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider) {

    // setInterval(() => {
    //   if (!this.gettingHomePageData && !this.loading && this.userID) {
    //     this.graphQLService.reset(Page.Home);
    //     this.graphQLService.getHomeData(this.userID)
    //       .then(result => {
    //         const latestAlertId = Math.max(...this.alerts.map(a => a.id));
    //         const alerts = result.data.alerts.data.map(a => new Alert(a))
    //           .filter(c => c.id > latestAlertId);
    //         if (alerts && alerts.length) {
    //           const groupedTickets = _.keyBy(_.chain(result.data.alerts.data.filter(c => c.ticket))
    //             .groupBy(a => a.ticket.id)
    //             .toPairs()
    //             .map(g => {
    //               return ({ id: g[0], latest: g[1][0].addDate })
    //             })
    //             .value(), 'id');
    //           const alerts = result.data.alerts.data
    //             .filter(c => !c.ticket || (c.ticket && c.addDate === groupedTickets[c.ticket.id].latest))
    //             .map(a => new Alert(a));
    //           this.alerts.push(...alerts);
    //         }
    //         this.gettingHomePageData = false;
    //       });
    //   }
    // }, 5000);
  }

  ionViewDidLoad(): void {
    // hack fix for tab pagination appearing when moving between root tab navs
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 20);
  }

  ionViewDidEnter(): void {
    // hack fix for ink bar going away moving between root tab navs
    this.appStateService.setPage(Page.Home);
    this.tabGroup.realignInkBar();
    this.appStateService.setTabHidden(false);

    this.loading = true;
    this.alerts = [];

    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.authService.getAuthFields()
      .then(authFields => {
        if (authFields && authFields.userID) {
          // this.userID = authFields.userID;
          this.graphQLService.getHomeData(authFields.userID)
            .then((result) => {
              const groupedTickets = _.keyBy(_.chain(result.data.alerts.data.filter(c => c.ticket))
                .groupBy(a => a.ticket.id)
                .toPairs()
                .map(g => {
                  return ({ id: g[0], latest: g[1][0].addDate })
                })
                .value(), 'id');
              this.alerts = result.data.alerts.data
                .filter(c => !c.ticket || (c.ticket && c.addDate === groupedTickets[c.ticket.id].latest))
                .map(a => new Alert(a));

              this.setAppBadge();

              this.user = new User(result.data.user);
              this.loading = result.loading;
            })
            .catch((res: HttpErrorResponse) => {
              if (res && res.status) {
                this.homeErrorMessage = res.statusText;
              } else {
                this.homeErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
              }
              this.loading = false;
            });
        }
      });
  }

  public setAppBadge(): void {
    if (this.alerts) {
      const unopened = this.alerts.filter(a => !a.isOpened).length;
      if (unopened) {
        this.badge.set(unopened);
      } else {
        this.badge.clear();
      }
    } else {
      this.badge.clear();
    }
  }

  public toggleTabs(): void {
    this.alerts.forEach(a => a['opened'] = false);
    this.filterByContractID = !this.filterByContractID;
    this.tabGroup.realignInkBar();
  }

  public dismiss(selectedItem: ItemSliding, alert: Alert) {
    selectedItem.close();
    const index = this.alerts.findIndex(a => a.id === alert.id);
    this.alerts.splice(index, 1);
    this.alerts = _.cloneDeep(this.alerts);  // rebuild for pure filter
    alert.isOpened = true;
    this.graphQLService.updateAlert(Number(alert.id), { isRead: true, isOpened: true } as Alert)
      .then(() => {
        this.toastController.create({
          message: 'Alert Dismissed',
          duration: 2000
        }).present();
        this.setAppBadge();
        this.graphQLService.reset(Page.Home);
      });
  }

  public snooze(selectedItem: ItemSliding, alert: Alert) {
    selectedItem.close();
    const index = this.alerts.findIndex(a => a.id === alert.id);
    this.alerts.splice(index, 1);
    this.alerts = _.cloneDeep(this.alerts); // rebuild for pure filter
    this.toastController.create({
      message: 'Alert Snoozed',
      duration: 2000
    }).present();
  }

  public delete(selectedItem: ItemSliding, alert: Alert) {
    selectedItem.close();
    const index = this.alerts.findIndex(a => a.id === alert.id);
    this.alerts.splice(index, 1);
    this.alerts = _.cloneDeep(this.alerts);  // rebuild for pure filter
    alert.isOpened = true;
    this.graphQLService.updateAlert(Number(alert.id), { isRead: true, isOpened: true } as Alert)
      .then(() => {
        this.toastController.create({
          message: 'Alert Deleted',
          duration: 2000
        }).present();
        this.setAppBadge();
        this.graphQLService.reset(Page.Home);
      });
  }

  public read(alert: Alert) {
    if (!alert.isOpened) {
      alert.isOpened = true;
      this.graphQLService.updateAlert(Number(alert.id), {
        isOpened: true,
        foldedMessage: String(alert.ticket.id),
        unfoldedMessage: String(alert.ticket.id) } as Alert);
      this.setAppBadge();
      this.graphQLService.reset(Page.Home);
    }
  }

  public goAction(alert: Alert): void {
    const actionLink = alert.actionLink(this.user);
    if (alert.actionIsRoot()) {
      this.navCtrl.parent.select(actionLink.tabIndex);
    } else {
      this.navCtrl.push(actionLink.page, actionLink.params);
    }
  }

  public archiveTicket(selectedItem: ItemSliding, alert: Alert): void {
    selectedItem.close();
    const index = this.alerts.findIndex(a => a.id === alert.id);
    this.alerts.splice(index, 1);
    this.alerts = _.cloneDeep(this.alerts);  // rebuild for pure filter
    alert.isOpened = true;
    Promise.all([
      this.graphQLService.updateAlert(Number(alert.id), { isRead: true, isOpened: true,
        foldedMessage: String(alert.ticket.id), unfoldedMessage: String(alert.ticket.id) } as Alert),
      this.graphQLService.updateTicket(Number(alert.ticketID), { isComplete: true } as Ticket)
    ]).then(() => {
        this.toastController.create({
          message: 'Ticket Archived',
          duration: 2000
        }).present();
        this.setAppBadge();
        this.graphQLService.reset(Page.Home);
      });
  }

  public unopenedAlerts(filterByContractID: boolean): number {
    return this.alerts ? this.alerts.filter(a =>
         (filterByContractID && a.contractID && !a.isOpened)
      || (!filterByContractID && !a.contractID && !a.isOpened)).length : 0;
  }
}
