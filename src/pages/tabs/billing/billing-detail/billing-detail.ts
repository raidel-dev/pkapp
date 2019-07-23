import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { Contract } from '../../../../shared/models/contract/contract';
import { Invoice } from '../../../../shared/models/invoice/invoice';

@IonicPage()
@Component({
  selector: 'page-billing-detail',
  templateUrl: 'billing-detail.html',
})
export class BillingDetailPage {

  public contract: Contract;

  public loading = true;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.contract = this.navParams.data.contract;
  }

  public getDecimalPart(total: number): string {
    return HelperServiceProvider.getDecimalPart(total);
  }

  public getMainPart(total: number): string {
    return HelperServiceProvider.getMainPart(total);
  }

  public daysUntilDue(invoice: Invoice): number {
    return invoice ? HelperServiceProvider.daysFromToday(new Date(invoice.dueDate)) : 0;
  }
}
