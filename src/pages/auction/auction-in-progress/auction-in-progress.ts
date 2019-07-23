import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../providers/helper/helper-service';
import { Contract } from '../../../shared/models/contract/contract';
import { RfqSessionRate } from '../../../shared/models/rfq-session-rate/rfq-session-rate';
import { RfqSession } from '../../../shared/models/rfq-session/rfq-session';
import { AuctionAwardPage } from './auction-award/auction-award';

@IonicPage()
@Component({
  selector: 'page-auction-in-progress',
  templateUrl: 'auction-in-progress.html',
})
export class AuctionInProgressPage {

  public environment = environment;

  public contract: Contract;
  public contractID: string;
  public rfqSession: RfqSession;
  public loading = true;
  public allowBack = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private graphQLService: GraphqlServiceProvider,) {
    this.contractID = navParams.data.contractID;
    this.allowBack = navParams.data.allowBack !== undefined ? navParams.data.allowBack : true;

    if (!this.allowBack) { // basically make it so that the pop goes back to the previous root page
      this.navCtrl.remove(1, this.navCtrl.length() - 1);
    }
  }

  ionViewDidEnter() {
    this.loading = true;
    this.rfqSession = null;
    this.contract = null;
    this.graphQLService.getAuctionInProgressContractData(this.contractID)
      .then(contractResult => {
        if (contractResult.data.contract) {
          this.contract = new Contract(contractResult.data.contract);
          this.graphQLService.getAuctionInProgressData(this.contract)
            .then(result => {
              if (result.data.rfqSession) {
                this.rfqSession = new RfqSession(result.data.rfqSession);
                const rates = result.data.rates.data
                  .map(r => HelperServiceProvider.toFriendlyRate(r))
                  .filter(r => this.rfqSession.products.find(p => p.productID.toLowerCase() === r.productID.toLowerCase())
                            && this.rfqSession.products.find(p => p.term === r.term));

                this.rfqSession.rates.push(...rates.map(r => new RfqSessionRate(r, false, this.contract.serviceTypeID)));
                this.rfqSession.rates = _.cloneDeep(this.rfqSession.rates); // reassign for pure filter bestBids
              }
              this.loading = result.loading;
            });
        }
      });

  }

  public getFontAdjustment(rate: number): string {
    switch(String(rate).length) {
      case 8: {
        return 'font-25';
      }
      case 7: {
        return 'font-30';
      }
      case 6:
      default: {
        return 'font-35';
      }
    }
  }

  public goAwardDetail(rate: RfqSessionRate) {
    if (this.rfqSession && this.contract) {
      this.navCtrl.push(AuctionAwardPage, { rate, rfqSession: this.rfqSession });
    }
  }
}
