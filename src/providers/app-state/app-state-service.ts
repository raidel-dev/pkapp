import { Injectable } from '@angular/core';
import { Platform, App } from 'ionic-angular';

import { Page } from '../../shared/models/app-state/page';

@Injectable()
export class AppStateServiceProvider {

  private deviceWidth: number;
  private deviceHeight: number;
  private activePage: Page;
  private platformClass: string;
  private isTabHidden: boolean = false;

  constructor(private plt: Platform, private app: App) {
    this.deviceHeight = plt.height();
    this.deviceWidth = plt.width();
    this.platformClass = 'is-' + this.isIos() ? 'ios' : 'android';
  }

  public setRoot(page: any, params?: any): void {
    this.app.getRootNavs()[0].setRoot(page, params);
  }

  public setPage(page: Page): void {
    this.activePage = page;
  }

  public getPage(): Page {
    return this.activePage;
  }

  public isIos(): boolean {
    return this.plt.is('ios');
  }

  public getPlatformClass(): string {
    return this.platformClass;
  }

  public setTabHidden(isTabHidden: boolean): void {
    this.isTabHidden = isTabHidden;
  }

  public getTabHiddenStatus(): boolean {
    return this.isTabHidden;
  }

  public getDeviceHeight(): number {
    return this.deviceHeight;
  }

  public getDeviceWidth(): number {
    return this.deviceWidth;
  }
}
