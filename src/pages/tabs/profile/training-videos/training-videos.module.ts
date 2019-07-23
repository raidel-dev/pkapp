import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingVideosPage } from './training-videos';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    TrainingVideosPage,
  ],
  entryComponents: [
    TrainingVideosPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(TrainingVideosPage),
  ],
})
export class TrainingVideosPageModule {}
