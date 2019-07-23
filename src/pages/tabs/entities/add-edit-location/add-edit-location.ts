import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../shared/abstract-page-form';
import { ContractLocation } from '../../../../shared/models/contract-location/contract-location';
import { ServiceType } from '../../../../shared/models/service-type/service-type';
import { State } from '../../../../shared/models/state/state';
import { DefaultUtilityMap } from '../../../../shared/models/utility/default-utility-map';
import { RateClass } from '../../../../shared/models/utility/rate-class';
import { Utility } from '../../../../shared/models/utility/utility';
import { Zone } from '../../../../shared/models/utility/zone';
import { ZipCode } from '../../../../shared/models/zip-code/zip-code';
import { Constants } from '../../../../shared/constants';
import { SampleBillPage } from '../../../sampleutilitybills/sample-bill/sample-bill';

@IonicPage()
@Component({
  selector: 'page-add-edit-location',
  templateUrl: 'add-edit-location.html',
})
export class AddEditLocationPage extends AbstractPageForm {

  private addEditLocationCallback: Function;
  private existingLocationForm: FormGroup;
  private existingLocation: ContractLocation;

  public addEditTitle = 'Save Location';
  public addEditLocationErrorMessage = '';
  public addEditEnabled = true;
  public loadingUtilities = false;
  public loadingZipCode = false;
  public loadingUtilityProperties = false;
  public zipCodeErrorMessage = '';

  public utilities: Utility[];
  public states: State[];
  public zones: Zone[];
  public rateClasses: RateClass[];
  public citiesInZipCode: string[];
  public defaultZone: string;
  public serviceType: ServiceType;
  public defaultUtilities: DefaultUtilityMap[];
  public utilityErrorMessage: string;
  public accountNumFormatHelp: string;
  public accountNumLabel: string;

  public utilityAccountNumLength: number;
  public index: number;

  public Constants = Constants;

  public addEditLocationForm: FormGroup;
  public startAddEditLocationFormValidation = false;

  constructor(public navCtrl: NavController,
    public appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    super(appStateService);

    this.addEditLocationCallback = this.navParams.get("callback");
    this.serviceType = this.navParams.data.serviceType;
    this.existingLocationForm = this.navParams.data.locationForm;
    this.existingLocation = this.navParams.data.contractLocation;
    this.index = this.navParams.data.index;

    this.graphQLService.getAddEditLocationData()
      .then(result => {
        this.states = result.data.states.data.map(s => new State(s));
      });

    this.addEditLocationForm = new FormGroup({
      contractLocationID: new FormControl(this.existingLocation
        ? this.existingLocation.contractLocationID : ''),
      address1: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('address1').value
        : this.existingLocation ? this.existingLocation.address1 : '', [Validators.required]),
      address2: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('address2').value
        : this.existingLocation ? this.existingLocation.address2 : ''),
      city: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('city').value
        : this.existingLocation ? this.existingLocation.city : '', [Validators.required]),
      stateID: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('stateID').value
        : this.existingLocation ? this.existingLocation.stateID : '', [Validators.required]),
      stateShort: new FormControl({ value: this.existingLocationForm
        ? this.existingLocationForm.get('stateShort').value
        : this.existingLocation ? this.existingLocation.state.stateShort : '', disabled: true }, [Validators.required]),
      stateLong: new FormControl({ value: this.existingLocationForm
        ? this.existingLocationForm.get('stateShort').value
        : this.existingLocation ? this.existingLocation.state.stateLong : '', disabled: true }, [Validators.required]),
      zipCode: new FormControl(this.existingLocationForm
        ? String(this.existingLocationForm.get('zipCode').value)
        : this.existingLocation ? String(this.existingLocation.zipCode) : '', [Validators.required]),
      zipCodeValid: new FormControl(false, [Validators.requiredTrue]),
      annualUsage: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('annualUsage').value
        : this.existingLocation ? this.existingLocation.annualUsage : '', [Validators.required, Validators.min(1)]),
      utility: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('utility').value
        : this.existingLocation ? this.existingLocation.utility : '', [Validators.required]),
      utilityAccountNum: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('utilityAccountNum').value
        : this.existingLocation ? this.existingLocation.utilityAccountNum : '', [Validators.required]),
      utilityMeterNum: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('utilityMeterNum').value
        : this.existingLocation ? this.existingLocation.utilityMeterNum : ''),
      utilityNameKey: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('utilityNameKey').value
        : this.existingLocation ? this.existingLocation.utilityNameKey : ''),
      utilityReferenceNum: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('utilityReferenceNum').value
        : this.existingLocation ? this.existingLocation.utilityReferenceNum : ''),
      zone: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('zone').value
        : this.existingLocation ? this.existingLocation.zone : ''),
      rateClass: new FormControl(this.existingLocationForm
        ? this.existingLocationForm.get('rateClass').value.name
        : this.existingLocation ? this.existingLocation.rateClass : '')
    });

    if (this.existingLocationForm || this.existingLocation) {
      this.getZipCode(true);
    } else {
      this.setUtilityValidators();
    }
  }

  get address1() { return this.addEditLocationForm.get('address1'); }
  get address2() { return this.addEditLocationForm.get('address2'); }
  get zipCode() { return this.addEditLocationForm.get('zipCode'); }
  get zipCodeValid() { return this.addEditLocationForm.get('zipCodeValid'); }
  get stateID() { return this.addEditLocationForm.get('stateID'); }
  get stateShort() { return this.addEditLocationForm.get('stateShort'); }
  get stateLong() { return this.addEditLocationForm.get('stateLong'); }
  get city() { return this.addEditLocationForm.get('city'); }
  get utility() { return this.addEditLocationForm.get('utility'); }
  get annualUsage() { return this.addEditLocationForm.get('annualUsage'); }
  get utilityAccountNum() { return this.addEditLocationForm.get('utilityAccountNum'); }
  get utilityNameKey() { return this.addEditLocationForm.get('utilityNameKey'); }
  get utilityMeterNum() { return this.addEditLocationForm.get('utilityMeterNum'); }
  get utilityReferenceNum() { return this.addEditLocationForm.get('utilityReferenceNum'); }
  get zone() { return this.addEditLocationForm.get('zone'); }
  get rateClass() { return this.addEditLocationForm.get('rateClass'); }

  ionViewDidLoad() { }

  public addEditLocation(): void {
    this.addEditLocationErrorMessage = '';
    this.startAddEditLocationFormValidation = true;
    this.setTouched(this.addEditLocationForm);
    if (this.addEditLocationForm.valid) {
      this.addEditEnabled = false;
      if (this.addEditTitle === 'Save Location') {
        this.addEditTitle = 'Saving...';
      }
      this.addEditLocationCallback(this.addEditLocationForm, this.index)
        .then(()=> {
          this.addEditEnabled = true;
          this.addEditTitle = 'Save Location';
          this.navCtrl.pop();
        })
        .catch(() => {
          this.addEditEnabled = true;
          this.addEditTitle = 'Save Location';
          this.addEditLocationErrorMessage = 'There was a problem saving or adding your contract location, please contact PK Support.'
        });
    }
  }

  public resetLoadedValues(isFromLoading: boolean): void {
    this.citiesInZipCode = null;
    this.utilities = null;
    this.zones = null;
    this.rateClasses = null;
    this.defaultZone = null;
    if (!isFromLoading) {
      this.stateID.setValue(null);
      this.stateShort.setValue(null);
      this.stateLong.setValue(null);
      this.city.setValue(null);
      this.utility.setValue(null);
      this.zone.setValue(null);
      this.rateClass.setValue(null);
    }
  }

  public getZipCode(isFromLoading: boolean): void {
    if (this.zipCode.value.length === 5) {
      this.zipCode.disable();
      this.loadingZipCode = true;
      this.zipCodeErrorMessage = '';
      this.loadingUtilityProperties = true;
      this.loadingUtilities = true;
      this.resetLoadedValues(isFromLoading);
      this.graphQLService.getZipCodeWithDefaultUtilities(this.zipCode.value, this.serviceType.serviceTypeID)
        .then(zipCodeResult => {
          const zipCode = new ZipCode(zipCodeResult.data.zipCode);
          this.defaultUtilities = zipCodeResult.data.zipCode.defaultUtilities.map(d => new DefaultUtilityMap(d));
          this.citiesInZipCode = zipCode.city;
          this.defaultZone = zipCode.defaultUtilityZone;
          this.stateID.setValue(zipCode.stateID);
          this.stateShort.setValue(zipCode.stateShort);
          this.stateLong.setValue(zipCode.stateLong);

          if (isFromLoading) {
            this.city.setValue(this.citiesInZipCode.find(c => c === this.city.value));
          } else {
            if (this.citiesInZipCode.length) {
              this.city.setValue(this.citiesInZipCode[0]);
            } else {
              this.zipCodeErrorMessage = 'Invalid billing zipcode, unable to find any cities, please contact PK support.'
            }
          }

          this.loadUtilities(isFromLoading);
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

  private loadUtilities(isFromLoading): void {
    this.utilityErrorMessage = '';
    this.graphQLService.getUtilitiesWithProperties(this.stateID.value, this.serviceType.serviceTypeID)
      .then(utilitiesResult => {
        if (utilitiesResult && !utilitiesResult.errors) {
          this.utilities = utilitiesResult.data.utilities.data.map(u => new Utility(u));

          if (!this.utilities || !this.utilities.length) {
            this.utilityErrorMessage = `No registered utilities found for ${this.serviceType.name} in ${this.stateLong.value} at ${this.zipCode.value}.  Please try another combination.`;
          } else {
            if (isFromLoading) {
              this.utility.setValue(this.utilities.find(u => u.utilityID === this.utility.value.utilityID));
            } else {
              if (this.defaultUtilities && this.defaultUtilities.length) {
                const defaultUtility = this.defaultUtilities.find(d => d.serviceTypeID === this.serviceType.serviceTypeID);
                if (defaultUtility) {
                  const matchedUtility = this.utilities.find(u => u.utilityID === defaultUtility.utilityID);
                  if (matchedUtility) {
                    this.utility.setValue(matchedUtility);
                  }
                }
              }

              if (!this.utility.value) {
                this.utility.setValue(this.utilities[0]);
              }
            }

            this.loadUtilityProperties(isFromLoading);
            this.setUtilityValidators();
            this.resetTouched(this.addEditLocationForm);
          }
        }

        this.loadingUtilities = false;
      });
  }

  public loadUtilityProperties(isFromLoading: boolean): void {
    this.loadingUtilityProperties = true;
    this.rateClasses = (this.utility.value as Utility).rateClasses.map(r => new RateClass(r));
    if (this.rateClasses && this.rateClasses.length) {
      if (isFromLoading) {
        this.rateClass.setValue(this.rateClasses.find(r => r.name === this.rateClass.value));
      } else {
        const defaultRateClass = this.rateClasses.find(r => r.isDefault);
        if (defaultRateClass) {
          this.rateClass.setValue(defaultRateClass);
        } else {
          this.rateClass.setValue(this.rateClasses[0]);
        }
      }
    }

    this.zones = (this.utility.value as Utility).zones.map(z => new Zone(z));
    if (this.zones && this.zones.length) {
      if (isFromLoading) {
        this.zone.setValue(this.zones.find(z => z.name === this.zone.value));
      } else {
        if (this.defaultZone) {
          this.zone.setValue(this.zones.find(z => z.name === this.defaultZone));
        } else {
          this.zone.setValue(this.zones[0]);
        }
      }
    }

    this.loadingUtilityProperties = false;
  }

  private setUtilityValidators(): void {
    if (this.utility.value.showNameKey) {
      this.utilityNameKey.setValidators([Validators.required]);
    } else {
      this.utilityNameKey.setValidators([]);
    }
    if (this.utility.value.showMeterNum) {
      this.utilityMeterNum.setValidators([Validators.required]);
    } else {
      this.utilityMeterNum.setValidators([]);
    }
    if (this.utility.value.showReferenceNum) {
      this.utilityReferenceNum.setValidators([Validators.required]);
    } else {
      this.utilityReferenceNum.setValidators([]);
    }
    if (this.utility.value.accountNumFormat) {
      this.utilityAccountNum.setValidators([
        Validators.required,
        Validators.pattern(this.utility.value.accountNumFormat)
      ]);
      if (this.utility.value.accountNumFormat.includes('\\d{')
      && !isNaN(this.utility.value.accountNumFormat.replace('\\d{', '').replace('}', ''))) {
        this.utilityAccountNumLength = Number(this.utility.value.accountNumFormat.replace('\\d{', '').replace('}', ''));
      }
    } else {
      this.utilityAccountNum.setValidators([Validators.required]);
    }

    if (!this.zones || !this.zones.length) {
      this.zone.setValidators([]);
    } else {
      this.zone.setValidators([Validators.required]);
    }

    if (!this.rateClasses || !this.rateClasses.length) {
      this.rateClass.setValidators([]);
    } else {
      this.rateClass.setValidators([Validators.required]);
    }
  }

  public goSampleBill() {
    this.navCtrl.push(SampleBillPage, { attachmentID: this.utility.value.sampleBillAttachmentID });
  }
}
