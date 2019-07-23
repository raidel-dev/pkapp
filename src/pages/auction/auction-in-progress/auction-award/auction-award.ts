import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { environment } from '../../../../environments/environment';
import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Constants } from '../../../../shared/constants';
import { RfqSessionRate } from '../../../../shared/models/rfq-session-rate/rfq-session-rate';
import { RfqSession } from '../../../../shared/models/rfq-session/rfq-session';
import { ContractTermsPage } from './contract-terms/contract-terms';

@IonicPage()
@Component({
  selector: 'page-auction-award',
  templateUrl: 'auction-award.html',
})
export class AuctionAwardPage extends AbstractPageForm {

  public environment = environment;  
  public rate: RfqSessionRate;
  public rfqSession: RfqSession;
  public currentRate: number;
  

  constructor(public navCtrl: NavController,
    public appStateService: AppStateServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.rate = navParams.data.rate;
    this.rfqSession = navParams.data.rfqSession;
  }

  public getServiceTypeName(): string {
    return this.rfqSession.contract.serviceTypeID === Constants.serviceTypes.electricity
      ? 'Energy' 
      : 'Natural Gas';
  }

  public getFontAdjustment(rate: number): string {
    switch(String(rate).length) {
      case 8:
      case 7: {
        return 'font-19';
      }
      case 6:
      default: {
        return 'font-22';
      }
    }
  }

  public goContractTerms(): void {
    this.navCtrl.push(ContractTermsPage, { rate: this.rate, rfqSession: this.rfqSession });
  }
}
