import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Constants } from '../../../shared/constants';

@IonicPage()
@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {

  public pdfLink: string;
  public useBase64: boolean;

  constructor(public navCtrl: NavController,
    private storage: Storage,
    public navParams: NavParams) {
      const pdf = navParams.data.pdf;
      if (pdf) {
        this.useBase64 = true;
        this.pdfLink = pdf;
      } else {
        this.useBase64 = false;
        this.pdfLink = 'assets/pdfs/Power-Kiosk-Saas-Services-Agreement_2018.pdf';
      }
    }

  public agree(): void {
    this.storage.set(Constants.storageKeys.isTosAccepted, true);
    this.navCtrl.pop();
  }
}
