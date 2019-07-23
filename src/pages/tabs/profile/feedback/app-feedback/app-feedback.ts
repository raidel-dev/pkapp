import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AbstractPageForm } from '../../../../../shared/abstract-page-form';
import { AppStateServiceProvider } from '../../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { User } from '../../../../../shared/models/user/user';
import { Feedback } from '../../../../../shared/models/feedback/feedback';
import { ApolloError } from 'apollo-client';
import { HelperServiceProvider } from '../../../../../providers/helper/helper-service';

@IonicPage()
@Component({
  selector: 'page-app-feedback',
  templateUrl: 'app-feedback.html',
})
export class AppFeedbackPage extends AbstractPageForm {
  public user: User;

  public feedback: string;
  public rating = 0;
  public feedbackErrorMessage = '';
  public feedbackText = 'Submit';
  public feedbackEnabled = true;

  constructor(public navCtrl: NavController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private altCtrl: AlertController,
    public navParams: NavParams) {
      super(appStateService);
      this.user = new User(navParams.data.user);
  }


  public submit(): void {
    this.feedbackErrorMessage = '';
    if (this.feedback && this.feedback.trim() && this.rating) {
      this.feedbackEnabled = false;
      this.feedbackText = 'Submitting...';
      const feedback = this.createFeedbackDTO();
      this.graphQLService.createFeedback(feedback)
        .then((res) => {
          if (res) {
            const alert = this.altCtrl.create({
              title: 'Thank you!',
              message: 'Thank you for taking the time to provide your thoughts today. We really appreciate it!', buttons: [
                {
                  text: 'OK',
                  handler: () => { }
                }
              ]
            });
            alert.onDidDismiss(() => this.navCtrl.pop());
            alert.present();
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

    feedback.appID = 4;
    feedback.body = this.feedback;
    feedback.rating = this.rating;

    return feedback;
  }

  public onClickStar(selectedStar: number) {
    this.rating = selectedStar;
  }
}
