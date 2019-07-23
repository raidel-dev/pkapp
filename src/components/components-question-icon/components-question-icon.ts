import { Component } from '@angular/core';

@Component({
  selector: 'components-question-icon',
  templateUrl: 'components-question-icon.html'
})
export class ComponentsQuestionIconComponent {

  text: string;

  constructor() {
    console.log('Hello ComponentsQuestionIconComponent Component');
    this.text = 'Hello World';
  }

}
