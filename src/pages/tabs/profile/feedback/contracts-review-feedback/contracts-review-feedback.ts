import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReviewContractPage } from './review-contract/review-contract';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { Contract } from '../../../../../shared/models/contract/contract';
import { AuthServiceProvider } from '../../../../../providers/auth/auth-service';
import { ApolloError } from 'apollo-client';
import { HelperServiceProvider } from '../../../../../providers/helper/helper-service';
import { Constants } from '../../../../../shared/constants';
import { ContractDetailPage } from '../../../entities/contract-detail/contract-detail';

@IonicPage()
@Component({
  selector: 'page-contracts-review-feedback',
  templateUrl: 'contracts-review-feedback.html',
})
export class ContractsReviewFeedbackPage {

  public loading = true;
  public contractsReviewFeedbackErrorMessage = '';
  public Constants = Constants;

  public contracts: Contract[];

  constructor(public navCtrl: NavController,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.loading = true;
    this.contractsReviewFeedbackErrorMessage = '';
    this.authService.getAuthFields()
      .then(authFields => {
        if (authFields) {
          this.graphQLService.getContractReviewFeedbackData(authFields.userID)
            .then(result => {
              const today = new Date();
              this.contracts = result.data.user.contracts
                .map(c => new Contract(c))
                .filter(c => c.supplierID && !c.feedback && c.expirationDate.getTime() <= today.getTime());

              this.loading = result.loading;
            })
            .catch((res: ApolloError) => {
              if (res && res.graphQLErrors && res.graphQLErrors.length) {
                this.contractsReviewFeedbackErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
                this.graphQLService.sendErrorReport(res.graphQLErrors[0].message, res);
              } else {
                this.contractsReviewFeedbackErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
                this.graphQLService.sendErrorReport(res.message, res);
              }
            });
        }
      });
  }

  public goReviewContract(contract: Contract): void {
    this.navCtrl.push(ReviewContractPage, { contract, isFinal: this.contracts.length === 1 });
  }

  public goContractDetail(contract: Contract): void {
    this.navCtrl.push(ContractDetailPage, { contractID: contract.contractID });
  }
}
