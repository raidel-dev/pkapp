import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { QuestionAnswer } from '../../../shared/models/question-answer/question-answer';
import { Question } from '../../../shared/models/question/question';

@IonicPage()
@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html',
})
export class QuestionsPage {

  public questionIndex: number;
  public selectedQuestion: Question;
  public answers: QuestionAnswer[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.selectedQuestion = navParams.data.question;
    this.questionIndex = navParams.data.questionIndex;
  }

  ionViewDidLoad() { }

  selectAnswer(questionAnswer: QuestionAnswer) {
    this.selectedQuestion.selectedAnswer = questionAnswer;
    this.navCtrl.pop();
  }
}
