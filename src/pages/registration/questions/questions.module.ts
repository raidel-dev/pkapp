import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionsPage } from './questions';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    QuestionsPage,
  ],
  entryComponents: [
    QuestionsPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(QuestionsPage),
  ],
})
export class QuestionsPageModule {}
