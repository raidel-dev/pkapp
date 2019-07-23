import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { Constants } from '../../../../../shared/constants';
import { Page } from '../../../../../shared/models/app-state/page';
import { Contract } from '../../../../../shared/models/contract/contract';
import { Document } from '../../../../../shared/models/document/document';
import { RfqSessionRate } from '../../../../../shared/models/rfq-session-rate/rfq-session-rate';
import { RfqSession } from '../../../../../shared/models/rfq-session/rfq-session';
import { ContractTermsModal } from '../../../../modals/contract-terms/contract-terms-modal';
import { TabsPage } from '../../../../tabs/tabs';
import { AuctionCreateContractPage } from '../../../auction-create-contract/auction-create-contract';

@IonicPage()
@Component({
  selector: 'page-contract-terms',
  templateUrl: 'contract-terms.html',
})
export class ContractTermsPage {

  public rate: RfqSessionRate;
  public rfqSession: RfqSession;

  public awardContractErrorMessage: string;

  public awardSupplierText = 'Award Supplier & Create Contract';
  public awardSupplierEnabled = true;
  public cardIndex: number;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private altCtrl: AlertController,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    this.rate = navParams.data.rate;
    this.rfqSession = navParams.data.rfqSession;
    this.cardIndex = 0;
  }

  private isAward(): boolean {
    return this.rate.isAward;
  }

  public awardSupplier(): void {
    this.awardContractErrorMessage = '';
    this.awardSupplierText = 'Processing...';
    this.awardSupplierEnabled = false;

    const expirationDate = new Date(this.rfqSession.contract.effectiveDate);
    expirationDate.setMonth(new Date(this.rfqSession.contract.effectiveDate).getMonth() + Number(this.rate.term));

    this.graphQLService.updateContract(this.rfqSession.contract.contractID, {
      award: this.isAward(),
      supplierID: this.rate.supplierID,
      productID: this.rate.productID,
      term: this.rate.term,
      rate: this.rate.rate,
      status: Constants.quoteStatuses.ainp,
      expirationDate,
      rfqSessionID: this.rfqSession.id,
      rateDetail: this.rate.enRateDetail,
      regenerateDocuments: this.isAward() ? undefined : true
    } as Contract)
    .then(() => {
      this.graphQLService.reset(Page.Entity);
      this.graphQLService.reset(Page.Home);
      if (!this.isAward()) {
        this.rfqSession.contract.status = Constants.quoteStatuses.quote;
        this.rfqSession.contract.supplierID = this.rate.supplierID;
        this.graphQLService.getContractDocuments(this.rfqSession.contract.serviceTypeID, this.rfqSession.contract.supplierID,
          this.rfqSession.contract.stateID, this.rfqSession.contract.getUtilityID(), this.rfqSession.contract.annualUsage, Constants.quoteStatuses.quote)
          .then(result => {
            const documents = result.data.documents.data.map(d => new Document(d));
            const document = documents && documents.length ? documents[0] : null;

            if (!document) {
              const alert = this.altCtrl.create({
                title: 'Contract',
                message: 'Almost there! We are contacting the supplier now, and within 2-4 business hours you will receive an email with instructions on how to e-sign your new contract.', buttons: [
                  {
                    text: 'Got it',
                    handler: () => { }
                  }
                ]
              });
              alert.onDidDismiss(() => this.navCtrl.setRoot(TabsPage));
              alert.present();
            } else {
              this.navCtrl.push(AuctionCreateContractPage, { rate: this.rate, contractID: this.rfqSession.contract.contractID, allowBack: false, paymentTerms: this.cardIndex });
            }

            this.awardSupplierEnabled = true;
            this.awardSupplierText = 'Award Supplier & Create Contract';
          });
      } else {
        this.navCtrl.setRoot(TabsPage);
        this.awardSupplierEnabled = true;
        this.awardSupplierText = 'Award Supplier & Create Contract';
      }
    })
    .catch((res: HttpErrorResponse) => {
      if (res && res.status) {
        this.awardContractErrorMessage = res.statusText;
      } else {
        this.awardContractErrorMessage = 'There was a problem processing the request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
      }
      this.awardSupplierEnabled = true;
      this.awardSupplierText = 'Award Supplier & Create Contract';
    });
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

  public showModal(): void {
    var modal = this.modalCtrl.create(ContractTermsModal);
    modal.present();
  }

}
