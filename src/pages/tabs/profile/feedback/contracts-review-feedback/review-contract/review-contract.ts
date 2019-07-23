import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AbstractPageForm } from '../../../../../../shared/abstract-page-form';
import { AppStateServiceProvider } from '../../../../../../providers/app-state/app-state-service';
import { Feedback } from '../../../../../../shared/models/feedback/feedback';
import { Contract } from '../../../../../../shared/models/contract/contract';
import { GraphqlServiceProvider } from '../../../../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../../../../providers/helper/helper-service';
import { ApolloError } from 'apollo-client';
import { Constants } from '../../../../../../shared/constants';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-review-contract',
  templateUrl: 'review-contract.html',
})
export class ReviewContractPage extends AbstractPageForm {

  public feedback: string;
  public rating = 0;
  public contract: Contract;
  public isFinal: boolean;

  public feedbackErrorMessage = '';
  public feedbackEnabled = true;
  public feedbackText = 'Submit';

  public Constants = Constants;

  constructor(public navCtrl: NavController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    public navParams: NavParams,
    private storage: Storage,
    private altCtrl: AlertController) {
      super(appStateService);
      this.contract = navParams.data.contract;
      this.isFinal = navParams.data.isFinal;
  }

  public onClickStar(selectedStar: number) {
    this.rating = selectedStar;
  }

  public submit() {
    this.feedbackErrorMessage = '';
    if (this.feedback && this.feedback.trim() && this.rating) {
      this.feedbackEnabled = false;
      this.feedbackText = 'Submitting...';
      const feedback = this.createFeedbackDTO();
      this.graphQLService.createFeedback(feedback)
        .then((res) => {
          if (res) {
            this.altCtrl.create({
              title: 'Thank you!',
              message: 'Thank you for taking your time for the review. We love to hear about our great staff and services. We really appreciate it!', buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    if (this.isFinal) {
                      // remove the previous page so we can pop to the
                      this.navCtrl.remove(this.navCtrl.length() - 2, 1);
                      this.storage.set(Constants.storageKeys.showFeedbackPopup, true)
                    }
                    this.navCtrl.pop();
                  }
                }
              ]
            }).present();
          }
          this.feedbackText = 'Submit';
          this.feedbackEnabled = true;
        })
        .catch((res: ApolloError) => {
          if (res && res.graphQLErrors && res.graphQLErrors.length) {
            this.feedbackErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
            this.graphQLService.sendErrorReport(res.graphQLErrors[0].message, res);
          } else {
            this.feedbackErrorMessage = 'There was a problem sending the feedback, please try again later or contact customer support at support@octipower.com.'
            this.graphQLService.sendErrorReport(res.message, res);
          }
          this.feedbackText = 'Submit';
          this.feedbackEnabled = true;
        });
    } else {
      this.feedbackErrorMessage = 'You must provide at least some text in your feedback response and a rating between one and five starts before you submit so that we can best serve you.';
    }
  }

  private createFeedbackDTO(): Feedback {
    const feedback = new Feedback();

    feedback.supplierID = this.contract.supplierID;
    feedback.contractID = this.contract.contractID;
    feedback.body = this.feedback;
    feedback.rating = this.rating;

    return feedback;
  }
}
