import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextMaskModule } from 'angular2-text-mask';
import { CalendarModule } from 'ion2-calendar';
import { IonicModule } from 'ionic-angular';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { ComponentsModule } from '../components/components.module';
import { EmojiPickerComponentModule } from '../components/emoji-picker/emoji-picker.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    TextMaskModule,
    PipesModule,
    HttpClientModule,
    CalendarModule,
    IonicModule,
    EmojiPickerComponentModule,
    ComponentsModule,
    FontAwesomeModule,
    NgxExtendedPdfViewerModule,
    PinchZoomModule
  ],
  exports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    MatBadgeModule,
    MatIconModule,
    TextMaskModule,
    PipesModule,
    HttpClientModule,
    CalendarModule,
    IonicModule,
    EmojiPickerComponentModule,
    ComponentsModule,
    FontAwesomeModule,
    NgxExtendedPdfViewerModule,
    PinchZoomModule
  ]
})
export class SharedModule {}
