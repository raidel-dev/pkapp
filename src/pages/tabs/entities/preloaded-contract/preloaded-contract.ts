import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Constants } from '../../../../shared/constants';
import { Contract } from '../../../../shared/models/contract/contract';
import { Customer } from '../../../../shared/models/customer/customer';
import { Entity } from '../../../../shared/models/entity/entity';

import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-preloaded-contract',
  templateUrl: 'preloaded-contract.html',
})
export class PreloadedContractPage extends AbstractPageForm {

  public loading = true;
  public contracts: Contract[];
  public entity: Entity;
  public Constants = Constants;

  public searchQuery: string;

  public isFocusDes: boolean;
  public preloadedContractErrorMessage = '';

  constructor(public navCtrl: NavController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    public navParams: NavParams) {
    super(appStateService);
    this.entity = this.navParams.data.entity;
    this.preloadedContractErrorMessage = '';
    this.authService.getAuthFields()
      .then(authFields => {
        if (authFields) {
          this.graphQLService.getPreloadedContractData(authFields.userID)
            .then(result => {
              this.contracts = result.data.user.contracts.map(d => new Contract(d));
              this.loading = result.loading;
            })
            .catch((res: HttpErrorResponse) => {
              if (res && res.status) {
                this.preloadedContractErrorMessage = res.statusText;
              } else {
                this.preloadedContractErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
              }
              this.loading = false;
            });
        }
      });
  }

  public isFocus() {
    this.isFocusDes = true;
  }

  public isBlur() {
    this.isFocusDes = false;
  }

  public addToEntity(contract: Contract): void {
    contract.addButtonEnabled = false;
    contract.addButtonText = 'Adding...';
    contract.errorMessage = '';
    this.graphQLService.updateCustomer(contract.customerID, {
      entityID: this.entity.id
    } as Customer).then(() => {
      contract.addButtonText = 'Added!';
      contract.customer.entityID = this.entity.id;
      contract.customer.entity = this.entity;

      this.contracts = _.cloneDeep(this.contracts); // reassign for pure filters contractsWithoutEntitiesFilter and contractNumFilter
    })
    .catch((res: HttpErrorResponse) => {
      if (res && res.status) {
        contract.errorMessage = res.statusText;
      } else {
        contract.errorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
      }
      contract.addButtonText = 'Add';
      contract.addButtonEnabled = true;
    });
  }
}
