import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewEntityPage } from './new-entity';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    NewEntityPage,
  ],
  entryComponents: [
    NewEntityPage
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(NewEntityPage),
  ],
})
export class NewEntityPageModule {}
