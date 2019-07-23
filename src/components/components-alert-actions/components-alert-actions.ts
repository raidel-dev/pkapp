import { Component, Input } from '@angular/core';
import { Alert } from 'ionic-angular';

@Component({
  selector: 'components-alert-actions',
  templateUrl: 'components-alert-actions.html'
})
export class ComponentsAlertActionsComponent {

  @Input() alert: Alert

}
