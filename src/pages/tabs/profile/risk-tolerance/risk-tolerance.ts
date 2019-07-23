import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthServiceProvider } from '../../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { Constants } from '../../../../shared/constants';
import { QuestionAnswer } from '../../../../shared/models/question-answer/question-answer';
import { Question } from '../../../../shared/models/question/question';
import { User } from '../../../../shared/models/user/user';
import { QuestionsPage } from '../../../registration/questions/questions';
import { ApolloError } from 'apollo-client';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';

@IonicPage()
@Component({
  selector: 'page-risk-tolerance',
  templateUrl: 'risk-tolerance.html',
})
export class RiskTolerancePage {
  public loading = true;

  public questions: Question[];
  public riskToleranceErrorMessage = '';
  public finishErrorMessage = '';

  constructor(public navCtrl: NavController,
    public toastController: ToastController,
    private storage: Storage,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider) {

    this.authService.getAuthFields()
      .then(authFields => {
        Promise.all([
          this.storage.get(Constants.storageKeys.questionAnswers),
          authFields.userID
            ? this.graphQLService.getUserRiskToleranceData(authFields.userID)
            : this.graphQLService.getRiskToleranceData()
        ]).then(resps => {
          const questionAnswers = resps[0];
          const result = resps[1];
          this.questions = result.data.questions.data.map(q => new Question(q));
          
          const userQuestionAnswers =  result.data.user ? result.data.user.questionAnswers.map(a => new QuestionAnswer(a)) : null;

          if (questionAnswers && questionAnswers.length) {
            this.setQuestionAnswers(questionAnswers);
          } else if (userQuestionAnswers && userQuestionAnswers.length) {
            this.setQuestionAnswers(userQuestionAnswers);
            this.storage.set(Constants.storageKeys.questionAnswers, userQuestionAnswers);
          }

          this.loading = false;
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.riskToleranceErrorMessage = res.statusText;
          } else {
            this.riskToleranceErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
        });
      });
  }

  private setQuestionAnswers(questionAnswers: QuestionAnswer[]): void {
    questionAnswers.forEach((qa: QuestionAnswer) => {
      const question = this.questions.find(q => qa && q.id === qa.questionID);
      if (question) {
        question.selectedAnswer = qa;
      }
    });
  }
  
  public goAnswer(question: Question, questionIndex: number): void {
    this.navCtrl.push(QuestionsPage, { question, questionIndex })
  }

  ionViewDidEnter() {
    if (!this.loading) {
      this.finishErrorMessage = '';
      this.authService.getAuthFields()
        .then(authFields => {
          this.graphQLService.updateUser(authFields.userID, {
            questionAnswers: this.questions.map(q => q.selectedAnswer)
            .filter(qa => qa && qa.id)
            .map(q => new QuestionAnswer({ id: q.id } as QuestionAnswer))
          } as User)
            .then(() => {
              this.toastController.create({
                message: 'Response Saved',
                duration: 2000
              }).present();
            })
            .catch((res: ApolloError) => {
              if (res && res.graphQLErrors && res.graphQLErrors.length) {
                this.finishErrorMessage = HelperServiceProvider.sanitizeErrorMessage(res.graphQLErrors[0].message);
              } else {
                this.finishErrorMessage = 'There was a problem saving the response.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
              }
            });
        });
    }
  }
}
