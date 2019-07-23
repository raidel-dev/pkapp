import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Constants } from '../../../../shared/constants';
import { Entity } from '../../../../shared/models/entity/entity';
import { Page } from '../../../../shared/models/app-state/page';

import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-new-entity',
  templateUrl: 'new-entity.html',
})
export class NewEntityPage extends AbstractPageForm {
  public isFocusDes: boolean;

  public Constants = Constants;
  public contracts: any[] = [];

  public entityForm: FormGroup;
  public startNewEntityValidation = false;
  public newEntityErrorMessage = '';

  public submitText = 'Submit';
  public submitEnabled = true;

  public entities: Entity[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private altCtrl: AlertController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider) {
    super(appStateService);

    this.entities = navParams.data.entities;

    this.entityForm = new FormGroup({
      entityName: new FormControl('', [Validators.required]),
    });
  }

  get entityName() { return this.entityForm.get('entityName'); }

  public isFocus() {
    this.isFocusDes = true
  }
  
  public isBlur() {
    this.isFocusDes = false
  }

  public submit() {
    this.newEntityErrorMessage = '';
    this.setTouched(this.entityForm);
    this.startNewEntityValidation = true;
    this.submitText = 'Submitting...';
    this.submitEnabled = false;
    if (this.entityForm.valid) {
      const newEntity = new Entity({ name: this.entityName.value.trim() } as Entity);
      this.graphQLService.createEntity(newEntity)
        .then((entityResponse) => {
          const alert = this.altCtrl.create({
            title: 'New Contract Group',
            message: 'Your Contract Group has been successfully created', buttons: [
              {
                text: 'OK',
                handler: () => { }
              }
            ]
          });
          alert.onDidDismiss(() => {
            this.graphQLService.reset(Page.Entity);
            this.entities.push(new Entity(entityResponse.data.createEntity));
            this.entities = _.cloneDeep(this.entities);
            this.navCtrl.pop();
          });
          alert.present();
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.newEntityErrorMessage = res.statusText;
          } else {
            this.newEntityErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.submitText = 'Submit';
          this.submitEnabled = true;
        });  
    } else {
      this.submitText = 'Submit';
      this.submitEnabled = true;
    }
  }

}
