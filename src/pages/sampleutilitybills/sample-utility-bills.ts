import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SampleBillPage } from './sample-bill/sample-bill';
import { GraphqlServiceProvider } from '../../providers/graphql/graphql-service';
import { AppStateServiceProvider } from '../../providers/app-state/app-state-service';
import { AbstractPageForm } from '../../shared/abstract-page-form';
import { Utility } from '../../shared/models/utility/utility';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ZipCode } from '../../shared/models/zip-code/zip-code';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from '../../shared/constants';

@IonicPage()
@Component({
  selector: 'page-sample-utility-bills',
  templateUrl: 'sample-utility-bills.html',
})
export class SampleUtilityBillsPage extends AbstractPageForm {

  public menuid = "utility";
  public subtitle = "Any";

  public Constants = Constants;

  public utilities: Utility[];
  public sampleUtilityBillForm: FormGroup;
  public loadingUtilities = false;
  public loadingZipCode = false;
  public zipCodeErrorMessage = '';
  public utilityErrorMessage = '';
  public startSampleBillUtilityValidation = false;

  constructor(private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtl: MenuController) {
    super(appStateService);

    this.sampleUtilityBillForm = new FormGroup({
      serviceType: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      zipCodeValid: new FormControl(false, [Validators.requiredTrue]),
      selectedUtility: new FormControl('', [Validators.required]),
      stateID: new FormControl('')
    });
  }

  get zipCode() { return this.sampleUtilityBillForm.get('zipCode'); }
  get zipCodeValid() { return this.sampleUtilityBillForm.get('zipCodeValid'); }
  get selectedUtility() { return this.sampleUtilityBillForm.get('selectedUtility'); }
  get serviceType() { return this.sampleUtilityBillForm.get('serviceType'); }
  get stateID() { return this.sampleUtilityBillForm.get('stateID'); }



  public closeMenu() {
    this.menuCtl.close();
  }

  public chooseServiceType(serviceTypeID: string): void {
    this.serviceType.setValue(serviceTypeID);
  }

  public selectAnswerItem(utility: Utility) {
    this.selectedUtility.setValue(utility);
    this.subtitle = utility.name;
    this.closeMenu();
  }

  public openMenu() {

    this.menuCtl.enable(true, this.menuid);
    this.menuCtl.toggle(this.menuid);
  }

  public goSampleBill() {
    this.startSampleBillUtilityValidation = true;
    this.setTouched(this.sampleUtilityBillForm);
    if (this.sampleUtilityBillForm.valid) {
      this.navCtrl.push(SampleBillPage, { attachmentID: this.selectedUtility.value.sampleBillAttachmentID });
    }
  }

  public resetLoadedValues(): void {
    this.utilities = null;
    this.selectedUtility.setValue(null);
  }

  public getZipCode(): void {
    if (this.zipCode.value.length === 5) {
      this.zipCode.disable();
      this.loadingZipCode = true;
      this.zipCodeErrorMessage = '';
      this.loadingUtilities = true;
      this.resetLoadedValues();
      this.graphQLService.getZipCodeWithDefaultUtilities(this.zipCode.value, this.serviceType.value)
        .then(zipCodeResult => {
          const zipCode = new ZipCode(zipCodeResult.data.zipCode);
          this.stateID.setValue(zipCode.stateID);

          if (!zipCode.city.length) {
            this.zipCodeErrorMessage = 'Invalid zipcode, if you believe this to be an error, please contact PK support.'
          }

          this.loadUtilities();
          this.loadingZipCode = false;
          this.zipCode.enable();
          this.zipCodeValid.setValue(true);
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.zipCodeErrorMessage = res.statusText;
          } else {
            this.zipCodeErrorMessage = 'Invalid zipcode, if you believe this to be an error, please contact PK support.'
          }
          this.loadingZipCode = false;
          this.loadingUtilities = false;
          this.zipCode.enable();
          this.zipCodeValid.setValue(false);
        });
    }
  }

  private loadUtilities(): void {
    this.utilityErrorMessage = '';
    this.graphQLService.getUtilitiesWithProperties(this.stateID.value, this.serviceType.value)
      .then(utilitiesResult => {
        if (utilitiesResult && !utilitiesResult.errors) {
          this.utilities = utilitiesResult.data.utilities.data
            .map(u => new Utility(u))
            .filter(u => u.sampleBillAttachmentID);

          if (!this.utilities || !this.utilities.length) {
            this.utilityErrorMessage = `No registered utilities or utilities with sample bills found at ${this.zipCode.value}.`;
          } else {
            this.resetTouched(this.sampleUtilityBillForm);
          }
        }

        this.loadingUtilities = false;
      });
  }

}
