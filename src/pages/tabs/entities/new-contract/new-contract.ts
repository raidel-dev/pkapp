import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { AlertController, IonicPage, MenuController, ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { Constants } from '../../../../shared/constants';
import { Entity } from '../../../../shared/models/entity/entity';
import { ServiceType } from '../../../../shared/models/service-type/service-type';
import { State } from '../../../../shared/models/state/state';
import { Supplier } from '../../../../shared/models/supplier/supplier';
import { ZipCode } from '../../../../shared/models/zip-code/zip-code';
import { AuctionPage } from '../../../auction/auction';
import { AddEditLocationPage } from '../add-edit-location/add-edit-location';
import { User } from '../../../../shared/models/user/user';
import { Page } from '../../../../shared/models/app-state/page';

@IonicPage()
@Component({
  selector: 'page-new-contract',
  templateUrl: 'new-contract.html',
})
export class NewContractPage extends AbstractPageForm {
  public stepIndex = 1;

  public newEntityErrorMessage = '';
  public entities: Entity[];
  public states: State[];
  public serviceTypes: ServiceType[];
  public billingCitiesInZipCode: string[];
  public suppliers: Supplier[];
  public user: User;

  private defaultEntity = [{ name: 'None', selected: true } as Entity];

  public loading = true;
  public loadingZipCode = false;
  public loadingBillingZipCode = false;
  public loadingSuppliers = false;
  public loadingEntities = true;

  public zipCodeErrorMessage = '';
  public billingZipCodeErrorMessage = '';

  public newContractFormStep1: FormGroup;
  public newContractFormStep2: FormGroup;
  public newContractFormStep3: FormGroup;

  public step1ErrorMessage: string;
  public startStep1Validation = false;

  public step2ErrorMessage: string;
  public startStep2Validation = false;

  public step3ErrorMessage: string;
  public startStep3Validation = false;

  public submitButtonEnabled = true;
  public submitButtonText = 'Submit';

  public showNextStep = false;
  public isActiveContract = false;

  public Constants = Constants;

  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtl: MenuController,
    public appStateService: AppStateServiceProvider,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private altCtrl: AlertController) {
    super(appStateService);

    this.authService.getAuthFields()
      .then(authFields => {
        this.graphQLService.getNewContractPageData(authFields.userID)
          .then(result => {
            if (result.data.serviceTypes) {
              this.serviceTypes = result.data.serviceTypes.data.map(s => new ServiceType(s));
              this.user = new User(result.data.user);
              this.states = result.data.states.data.map(d => new State(d));
              this.entities = this.defaultEntity
                .concat(result.data.user.entities.map(d => new Entity(d)));

              this.buildNewContractForms();
            }
          });
      });
  }

  private buildNewContractForms(): void {
    this.newContractFormStep1 = new FormGroup({
      expirationDate: new FormControl('')
    });

    this.newContractFormStep2 = new FormGroup({
      DBAName: new FormControl(this.user.DBAName),
      firstName: new FormControl(this.user.fname, [Validators.required]),
      lastName: new FormControl(this.user.lname, [Validators.required]),
      title: new FormControl(this.user.title),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(Constants.validators.email)
      ]),
      phone: new FormControl(this.user.phone, [
        Validators.required,
        Validators.pattern(Constants.validators.phone)
      ]),
      phone2: new FormControl(this.user.phone2, [
        Validators.pattern(Constants.validators.phone)
      ]),
      billingAddress1: new FormControl(this.user.billingAddress1, [Validators.required]),
      billingAddress2: new FormControl(this.user.billingAddress2),
      billingCity: new FormControl(this.user.billingCity, [Validators.required]),
      billingStateID: new FormControl('', [Validators.required]),
      billingStateShort: new FormControl({ value: '', disabled: true }, [Validators.required]),
      billingStateLong: new FormControl({ value: '', disabled: true }, [Validators.required]),
      billingZipCode: new FormControl(this.user.billingZipCode, [Validators.required]),
      billingZipCodeValid: new FormControl(false, [Validators.requiredTrue]),
      serviceType: new FormControl(this.serviceTypes[0], [Validators.required]),
      selectedEntity: new FormControl(this.defaultEntity[0])
    });

    this.newContractFormStep3 = new FormGroup({
      locations: new FormArray([], [Validators.required])
    });

    this.loading = false;
    this.loadingEntities = false;

    this.getBillingZipCode(true);
  }

  get expirationDate() { return this.newContractFormStep1.get('expirationDate'); }

  get DBAName() { return this.newContractFormStep2.get('DBAName'); }
  get firstName() { return this.newContractFormStep2.get('firstName'); }
  get lastName() { return this.newContractFormStep2.get('lastName'); }
  get title() { return this.newContractFormStep2.get('title'); }
  get email() { return this.newContractFormStep2.get('email'); }
  get serviceType() { return this.newContractFormStep2.get('serviceType'); }
  get billingAddress1() { return this.newContractFormStep2.get('billingAddress1'); }
  get billingAddress2() { return this.newContractFormStep2.get('billingAddress2'); }
  get billingZipCode() { return this.newContractFormStep2.get('billingZipCode'); }
  get billingZipCodeValid() { return this.newContractFormStep2.get('billingZipCodeValid'); }
  get billingStateID() { return this.newContractFormStep2.get('billingStateID'); }
  get billingStateShort() { return this.newContractFormStep2.get('billingStateShort'); }
  get billingStateLong() { return this.newContractFormStep2.get('billingStateLong'); }
  get billingCity() { return this.newContractFormStep2.get('billingCity'); }
  get phone() { return this.newContractFormStep2.get('phone'); }
  get phone2() { return this.newContractFormStep2.get('phone2'); }
  get selectedEntity() { return this.newContractFormStep2.get('selectedEntity'); }

  get locations(): FormArray { return this.newContractFormStep3.get('locations') as FormArray; }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
  }



  public closeMenu() {
    this.menuCtl.close();
  }

  public openMenu() {

    this.menuCtl.enable(true, "entity");
    this.menuCtl.open("entity");
  }

  public selectParentEntity(entity: Entity) {
    this.selectedEntity.setValue(entity);
    this.closeMenu();
  }

  public showExpiration(): void {
    this.startStep1Validation = false;
    this.showNextStep = true;
    this.isActiveContract = true;
    this.expirationDate.setValue(null);
    this.expirationDate.setValidators([Validators.required]);
  }

  public noShowExpiration(): void {
    this.startStep1Validation = false;
    this.showNextStep = true;
    this.isActiveContract = false;
    this.expirationDate.setValue(null);
    this.expirationDate.setValidators([]);
  }

  public next(): void {
    if (this.stepIndex === 1) {
      this.startStep1Validation = true;
      this.step1ErrorMessage = '';
      this.setTouched(this.newContractFormStep1);
      if (this.newContractFormStep1.valid) {
        this.stepIndex++;
      }
    } else if (this.stepIndex === 2) {
      this.startStep2Validation = true;
      this.step2ErrorMessage = '';
      this.setTouched(this.newContractFormStep2);
      if (this.newContractFormStep2.valid) {
        this.stepIndex++;
      }
    } else if (this.stepIndex === 3) {
      this.stepIndex++;
    }
  }

  public previous(): void {
    if (--this.stepIndex < 1) this.stepIndex = 1;
  }

  public addNew(): void {
    this.altCtrl.create({
      title: 'New Contract Group',
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
          handler: () => { }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newEntity) {
              this.newEntityErrorMessage = '';
              this.loadingEntities = true;
              const newEntity = new Entity({ name: data.newEntity } as Entity);
              this.graphQLService.createEntity(newEntity)
                .then(entitiesResponse => {
                  this.graphQLService.reset(Page.Entity);
                  this.entities.push(entitiesResponse.data.createEntity);
                  this.entities = _.sortBy(this.entities, 'name');
                  this.selectParentEntity(entitiesResponse.data.createEntity);

                  this.loadingEntities = false;
                })
                .catch((res: HttpErrorResponse) => {
                  if (res && res.status) {
                    this.newEntityErrorMessage = res.statusText;
                  } else {
                    this.newEntityErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
                  }
                  this.loadingEntities = false;
                });
            }
          }
        }
      ]
    }).present();
  }

  public addLocation(location: FormGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this.locations.push(location);
      resolve();
    });
  }

  public goAddLocation(): void {
    this.navCtrl.push(AddEditLocationPage, {
      callback: this.addLocation.bind(this),
      serviceType: this.serviceType.value
    });
  }

  public editLocation(location: FormGroup, index: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.locations.removeAt(index);
      this.locations.insert(index, location);
      resolve();
    });
  }

  public goEditLocation(locationForm: FormGroup, index: number): void {
    this.navCtrl.push(AddEditLocationPage, {
      callback: this.editLocation.bind(this),
      serviceType: this.serviceType.value,
      locationForm,
      index
    });
  }

  public removeLocation(locations: FormArray, index: number): void {
    locations.removeAt(index);
  }

  private resetBillingLoadedValues(): void {
    this.billingCitiesInZipCode = null;
    this.billingStateID.setValue(null);
    this.billingStateShort.setValue(null);
    this.billingStateLong.setValue(null);
    this.billingCity.setValue(null);
  }

  public getBillingZipCode(isOnLoad = false): void {
    if (this.billingZipCode.value && this.billingZipCode.value.length === 5) {
      this.billingZipCode.disable();
      this.loadingBillingZipCode = true;
      this.billingZipCodeErrorMessage = '';
      if (!isOnLoad) {
        this.resetBillingLoadedValues();
      }
      this.graphQLService.getZipCode(this.billingZipCode.value)
        .then(zipCodeResult => {
          const zipCode = new ZipCode(zipCodeResult.data.zipCode);
          this.billingCitiesInZipCode = zipCode.city;
          this.billingStateID.setValue(zipCode.stateID);
          this.billingStateShort.setValue(zipCode.stateShort);
          this.billingStateLong.setValue(zipCode.stateLong);

          if (this.billingCitiesInZipCode.length) {
            if (!isOnLoad) {
              this.billingCity.setValue(this.billingCitiesInZipCode[0]);
            }
          } else {
            this.billingZipCodeErrorMessage = 'Invalid billing zipcode, unable to find any cities, please contact PK support.'
          }

          this.loadingBillingZipCode = false;
          this.billingZipCode.enable();
          this.billingZipCodeValid.setValue(true);
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.billingZipCodeErrorMessage = res.statusText;
          } else {
            this.billingZipCodeErrorMessage = 'Invalid billing zipcode, if you believe this to be an error, please contact PK support.'
          }
          this.loadingBillingZipCode = false;
          this.billingZipCode.enable();
          this.billingZipCodeValid.setValue(false);
        });
    }
  }

  private timeConverter(timeStamp: number): string {
    return HelperServiceProvider.unixTimeStampToString(timeStamp);
  }

  public openCalendar(): void {
    const options: CalendarModalOptions = {
      defaultDate: new Date(),
      canBackwardsSelected: true,
      title: 'Expiration Date'
    };

    const calendarModal = this.modalCtrl.create(CalendarModal, { options });

    calendarModal.present();
    calendarModal.onDidDismiss((date, type) => {
      if (type === 'done' && date) {
        this.expirationDate.setValue(this.timeConverter(date.time));
      }
    });
  }

  private buildContractRequest(): any {
    const locations = this.locations.controls.map(c => ({
      address1: c.get('address1').value,
      address2: c.get('address2').value ? c.get('address2').value : undefined,
      city: c.get('city').value,
      zipCode: String(c.get('zipCode').value),
      utility: {
        id: c.get('utility').value.utilityID,
      },
      utilityAccountNum: c.get('utilityAccountNum').value,
      utilityMeterNum: c.get('utilityMeterNum').value ? c.get('utilityMeterNum').value : undefined,
      utilityNameKey: c.get('utilityNameKey').value ? c.get('utilityNameKey').value : undefined,
      utilityReferenceNum: c.get('utilityReferenceNum').value ? c.get('utilityReferenceNum').value : undefined,
      rateClass: c.get('rateClass').value ? c.get('rateClass').value.name : '',
      zone: c.get('zone').value ? c.get('zone').value.name : undefined,
      annualUsage: HelperServiceProvider.unmaskAnnualUsage(c.get('annualUsage').value)
    }));

    var customer = {
      DBAName: this.DBAName.value ? this.DBAName.value : this.firstName.value.trim() + ' ' + this.lastName.value.trim(),
      contactFname: this.firstName.value.trim(),
      contactLname: this.lastName.value.trim(),
      contactTitle: this.title.value ? this.title.value : undefined,
      address1: locations[0].address1,
      address2: locations[0].address2 ? locations[0].address2 : undefined,
      city: locations[0].city,
      zipCode: locations[0].zipCode,
      billingAddress1: this.billingAddress1.value.trim(),
      billingAddress2: this.billingAddress2.value ? this.billingAddress2.value.trim() : undefined,
      billingZipCode: this.billingZipCode.value,
      billingCity: this.billingCity.value.trim(),
      billingStateID: this.billingStateID.value.trim(),
      phone: this.phone.value.trim(),
      phone2: this.phone2.value ? this.phone2.value : undefined,
      mobile: this.phone.value.trim() ? this.phone.value.trim() : undefined,
      email: this.email.value.trim(),
      entityID: this.selectedEntity.value && this.selectedEntity.value.id ? Number(this.selectedEntity.value.id) : undefined
    } as any;

    var contract = {
      status: Constants.quoteStatuses.confirmed,
      expirationDate: this.expirationDate.value,
      customer: customer,
      locations: locations,
      serviceType: {
        name: this.serviceType.value.name
      },
      supplier: { },
      product: { }
    };

    return contract;
  }

  public getRatePlaceholder(): string {
    return this.serviceType
      ? this.serviceType.value.serviceTypeID === Constants.serviceTypes.electricity ? 'Rate (kWh)' : 'Rate (therms)'
      : 'Rate';
  }

  public goAuction(): void {
    this.navCtrl.push(AuctionPage, {
      contract: this.buildContractRequest(),
      contractTypeForm: this.newContractFormStep1,
      contractForm: this.newContractFormStep2,
      locationsForm: this.newContractFormStep3
    });
  }

  public goBack(): void {
    if (this.stepIndex === 1) {
      this.navCtrl.pop();
    } else {
      this.previous();
    }
  }
}
