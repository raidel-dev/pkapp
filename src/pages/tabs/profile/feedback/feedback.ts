import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppFeedbackPage } from './app-feedback/app-feedback';
import { ContractsReviewFeedbackPage } from './contracts-review-feedback/contracts-review-feedback';
import { Storage } from '@ionic/storage';
import { Constants } from '../../../../shared/constants';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { Feedback } from '../../../../shared/models/feedback/feedback';
import { AuthServiceProvider } from '../../../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  public lastFeedback: Feedback;

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    private altCtrl: AlertController,
    public navParams: NavParams) {
    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.getFeedbackData(authFields.userID)
          .then(result => {
            const feedbacks = result.data.feedbacks.data
              .map(f => new Feedback(f));

            if (feedbacks && feedbacks.length) {
              this.lastFeedback = feedbacks
                .sort((a, b) => a.addDate.getTime() < b.addDate.getTime() ? 1 : -1)[0];
            }
          });
      });
  }

  ionViewDidEnter() {
    this.storage.get(Constants.storageKeys.showFeedbackPopup)
      .then(res => {
        if (res) {
          this.storage.remove(Constants.storageKeys.showFeedbackPopup);
          if (!this.lastFeedback || this.within6Months())
            this.altCtrl.create({
              title: 'Feedback',
              message: 'Thank you for reviewing your contracts! Please take a moment to provide feedback on your app experience.', buttons: [
                {
                  text: 'Let\'s Go!',
                  handler: () => {
                    this.goAppFeedback();
                  }
                },
                {
                  text: 'No Thank You',
                  handler: () => { }
                }
              ]
            }).present();
        }
      })
  }

  private within6Months(): boolean {
    const today = new Date();
    const feedbackDate = new Date(this.lastFeedback.addDate);
    feedbackDate.setMonth(this.lastFeedback.addDate.getMonth() + 6);
    return today.getTime() > feedbackDate.getTime()
  }

  public goAppFeedback(): void {
    this.navCtrl.push(AppFeedbackPage);
  }

  public goContractReviewFeedback(): void {
    this.navCtrl.push(ContractsReviewFeedbackPage);
  }
}
