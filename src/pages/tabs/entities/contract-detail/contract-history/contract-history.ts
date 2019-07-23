import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Contract } from '../../../../../shared/models/contract/contract';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';

@IonicPage()
@Component({
  selector: 'page-contract-history',
  templateUrl: 'contract-history.html',
})
export class ContractHistoryPage {
  public contractHistories: Contract[];
  public loading = true;
  public contractHistoriesErrorMessage = '';

  constructor(public navCtrl: NavController,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    const contract = navParams.data.contract;

    this.graphQLService.getContractHistories(contract)
      .then(result => {
        this.contractHistories = result.data.contractHistories.data.map(c => new Contract(c));
        this.loading = result.loading;
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.contractHistoriesErrorMessage = res.statusText;
        } else {
          this.contractHistoriesErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.loading = false;
      });
  }

}
