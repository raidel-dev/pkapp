import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { IonicPage, MenuController, ModalController, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { RfqSession } from '../../../../shared/models/rfq-session/rfq-session';

@IonicPage()
@Component({
  selector: 'page-auction-extend',
  templateUrl: 'auction-extend.html',
})
export class AuctionExtendPage {

  public rfqSession: RfqSession;
  public endDate: Date;
  public endTime: string;
  public extendAuctionErrorMessage = '';
  public extendAuctionText = 'Submit';
  public extendAuctionEnabled = true;
  public loading = true;

  private originalEndDate: Date;

  public availableTimes = [
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
  ];

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private graphQLService: GraphqlServiceProvider,
    private appStateService: AppStateServiceProvider,
    private menuCtrl: MenuController,
    public navParams: NavParams) {
    this.rfqSession = navParams.data.rfqSession;

    this.setupDates();

    this.loading = false;
  }

  public setupDates(): void {
    this.originalEndDate = new Date(this.rfqSession.endDate);
    this.endDate = new Date(this.rfqSession.endDate);
    this.endTime = HelperServiceProvider.getFriendlyTimeString(new Date(this.rfqSession.endTime));
  }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
  }

  public openCalendar(): void {
    if (this.rfqSession) {
      let to = new Date(this.originalEndDate);
      to = new Date(to.setDate(this.originalEndDate.getDate() + 9));
      const options: CalendarModalOptions = {
        from: this.originalEndDate,
        to,
        title: 'New End Date'
      };

      const calendarModal = this.modalCtrl.create(CalendarModal, { options });

      calendarModal.present();
      calendarModal.onDidDismiss((date, type) => {
        if (type === 'done' && date) {
          this.endDate = new Date(this.timeConverter(date.time));
        }
      });
    }
  }

  public chooseEndTime(endTime: string): void {
    this.endTime = endTime;
  }

  private timeConverter(timeStamp: number): string {
    return HelperServiceProvider.unixTimeStampToString(timeStamp);
  }



  public closeMenu() {
    this.menuCtrl.close();
  }

  public openMenu() {
    if (this.rfqSession) {

      this.menuCtrl.enable(true, "endTimePicker");
      this.menuCtrl.open("endTimePicker");
    }
  }

  public submit(): void {
    if (this.rfqSession) {
      this.extendAuctionErrorMessage = '';
      this.extendAuctionEnabled = false;
      this.extendAuctionText = 'Submitting...';
      this.graphQLService.extendRfqSession(this.rfqSession.id, {
        endDate: this.endDate.toLocaleDateString(),
        endTime: this.endTime,
        maxExtends: this.rfqSession.maxExtends - 1
      } as RfqSession)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.extendAuctionErrorMessage = res.statusText;
        } else {
          this.extendAuctionErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.extendAuctionEnabled = true;
        this.extendAuctionText = 'Submit';
      });
    }
  }
}
