import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { Constants } from '../../../../shared/constants';
import { Contract } from '../../../../shared/models/contract/contract';
import { Entity } from '../../../../shared/models/entity/entity';
import { BillingDetailPage } from '../billing-detail/billing-detail';
import { BillingMethodPage } from '../billing-method/billing-method';

@IonicPage()
@Component({
  selector: 'page-billing-entity-invoices',
  templateUrl: 'billing-entity-invoices.html',
})
export class BillingEntityInvoicesPage {
  public entity: Entity;
  public contracts: Contract[];
  public buttonTitle = "Pay for all";
  public Constants = Constants;
  public cardNum = '2352 2532 2352 2352';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.entity = this.navParams.data.entity;

    this.contracts = this.entity.contracts
      .filter(c => !c.renewalID);
  }

  ionViewDidLoad() { }

  public goBillingDetail(contract: Contract) {
    this.navCtrl.push(BillingDetailPage, { contract })
  }

  public clickBillingDetail(contract: Contract) {
    contract['selected'] = !contract['selected'];
    this.buttonTitle = "Pay for all";
    if (this.entity.contracts.some(c => !c['selected'])) {
      this.buttonTitle = "Pay for selected items only";
    }
  }

  public getDecimalPart(total: number): string {
    return HelperServiceProvider.getDecimalPart(total);
  }

  public getMainPart(total: number): string {
    return HelperServiceProvider.getMainPart(total);
  }

  public goPaymentmethod() {
    this.navCtrl.push(BillingMethodPage);
  }
}
