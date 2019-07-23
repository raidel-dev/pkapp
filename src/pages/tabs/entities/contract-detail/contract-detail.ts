import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertController, IonicPage, MenuController, NavController, NavParams, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { ContractLocation } from '../../../../shared/models/contract-location/contract-location';
import { Contract } from '../../../../shared/models/contract/contract';
import { Customer } from '../../../../shared/models/customer/customer';
import { Entity } from '../../../../shared/models/entity/entity';
import { AddEditLocationPage } from '../add-edit-location/add-edit-location';
import { ContractHistoryPage } from './contract-history/contract-history';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { Page } from '../../../../shared/models/app-state/page';
import { AuctionInProgressPage } from '../../../auction/auction-in-progress/auction-in-progress';
import { Constants } from '../../../../shared/constants';

@IonicPage()
@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html',
})
export class ContractDetailPage {
  public contract: Contract;
  public contractID: string;
  public showHiddenBtn = 'Show full info';
  public isShowFullInfo = false;

  public Constants = Constants;
  public entities: Entity[];
  public loading = true;
  public newEntityErrorMessage = '';
  public contractDetailErrorMessage = '';

  private defaultEntity = [{ id: null, name: 'None', selected: true } as Entity];

  constructor(private menuCtl: MenuController,
    private altCtrl: AlertController,
    private toastController: ToastController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    private authService: AuthServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.contractID = this.navParams.data.contractID;

    this.contractDetailErrorMessage = '';
    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.getContractDetailData(authFields.userID, this.contractID)
          .then(result => {
            this.entities = this.defaultEntity.concat(result.data.user.entities.map(d => new Entity(d)));
            this.contract = new Contract(result.data.contract);
            this.loading = false;
          })
          .catch((res: HttpErrorResponse) => {
            if (res && res.status) {
              this.contractDetailErrorMessage = res.statusText;
            } else {
              this.contractDetailErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
            }
            this.loading = false;
          });
      });
  }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
  }

  public showHideFullInfo() {
    this.isShowFullInfo = !this.isShowFullInfo;
  }

  public goContracthistory() {
    this.navCtrl.push(ContractHistoryPage, { contract: this.contract });
  }

  public closeMenu() {
    this.menuCtl.close();
  }

  public openMenu() {
    this.menuCtl.enable(true, "entity");
    this.menuCtl.open("entity");
  }

  public editLocation(location: FormGroup, index: number): Promise<any> {
    return this.graphQLService.updateContractLocation(location.get('contractLocationID').value, {
      annualUsage: HelperServiceProvider.unmaskAnnualUsage(location.get('annualUsage').value),
      address1: location.get('address1').value,
      address2: location.get('address2').value ? location.get('address2').value : undefined,
      city: location.get('city').value,
      stateID: location.get('stateID').value,
      zipCode: String(location.get('zipCode').value),
      utilityAccountNum: location.get('utilityAccountNum').value,
      utilityMeterNum: location.get('utilityMeterNum').value ? location.get('utilityMeterNum').value : undefined,
      utilityNameKey: location.get('utilityNameKey').value ? location.get('utilityNameKey').value : undefined,
      utilityReferenceNum: location.get('utilityReferenceNum').value ? location.get('utilityReferenceNum').value : undefined,
      rateClass: location.get('rateClass').value ? location.get('rateClass').value.name : '',
      zone: location.get('zone').value ? location.get('zone').value : undefined,
      utilityID: location.get('utility').value.utilityID
    }).then(result => {
      this.toastController.create({
        message: 'Contract Location Updated',
        duration: 2000
      }).present();
      this.contract.locations[index] = new ContractLocation(result.data.updateContractLocation);
    });
  }

  public addLocation(location: FormGroup): Promise<any> {
    return this.graphQLService.createContractLocation({
      contractID: this.contract.contractID,
      annualUsage: HelperServiceProvider.unmaskAnnualUsage(location.get('annualUsage').value),
      address1: location.get('address1').value,
      address2: location.get('address2').value ? location.get('address2').value : undefined,
      city: location.get('city').value,
      stateID: location.get('stateID').value,
      zipCode: String(location.get('zipCode').value),
      utilityAccountNum: location.get('utilityAccountNum').value,
      utilityMeterNum: location.get('utilityMeterNum').value ? location.get('utilityMeterNum').value : undefined,
      utilityNameKey: location.get('utilityNameKey').value ? location.get('utilityNameKey').value : undefined,
      utilityReferenceNum: location.get('utilityReferenceNum').value ? location.get('utilityReferenceNum').value : undefined,
      rateClass: location.get('rateClass').value ? location.get('rateClass').value.name : '',
      zone: location.get('zone').value ? location.get('zone').value : undefined,
      utilityID: location.get('utility').value.utilityID
    }).then(result => {
      this.toastController.create({
        message: 'Contract Location Created',
        duration: 2000
      }).present();
      this.contract.locations.push(new ContractLocation(result.data.createContractLocation));
    });
  }

  public goAddEditLocation(contractLocation: ContractLocation, index: number): void {
    this.navCtrl.push(AddEditLocationPage, {
      callback: contractLocation ? this.editLocation.bind(this) : this.addLocation.bind(this),
      contractLocation,
      index,
      serviceType: this.contract.serviceType });
  }

  public addNew() {
    this.altCtrl.create({
      title: 'New Contract Group Name',
      message: 'Type name of a new contract group, which best classifies it.',
      inputs: [
        {
          name: 'newEntity',
          placeholder: 'New Contract Group'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: "cancel",
          handler: data => {

          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newEntity) {
              this.newEntityErrorMessage = '';
              this.loading = true;
              const newEntity = new Entity({ name: data.newEntity } as Entity);
              this.graphQLService.createEntity(newEntity)
                .then(result => {
                  this.graphQLService.reset(Page.Entity);
                  this.toastController.create({
                    message: 'Contract Group Created',
                    duration: 2000
                  }).present();
                  this.entities.push(result.data.createEntity);
                  this.entities = _.sortBy(this.entities, 'name');

                  this.loading = false;
                })
                .catch((res: HttpErrorResponse) => {
                  if (res && res.status) {
                    this.newEntityErrorMessage = res.statusText;
                  } else {
                    this.newEntityErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
                  }
                  this.loading = false;
                });
            }
          }
        }
      ]
    }).present();
  }

  public selectParentEntity(entity: Entity) {
    this.contractDetailErrorMessage = '';
    this.closeMenu();
    const customer = (entity.id ? { entityID: Number(entity.id) } : { entity: null }) as Customer;
    this.graphQLService.updateCustomer(this.contract.customerID, customer)
      .then(() => {
        this.graphQLService.reset(Page.Entity);
        this.toastController.create({
          message: 'Saved to Contract Group',
          duration: 2000
        }).present();
        this.contract.customer.entityID = entity.id;
        this.contract.customer.entity = entity;
      })
      .catch((res: HttpErrorResponse) => {
        if (res && res.status) {
          this.contractDetailErrorMessage = res.statusText;
        } else {
          this.contractDetailErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
        }
        this.loading = false;
      });
  }

  public goAuction(): void {
    this.navCtrl.push(AuctionInProgressPage, { contractID: this.contractID });
  }
}
