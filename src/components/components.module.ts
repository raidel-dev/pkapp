import { NgModule } from '@angular/core';
import { ElectricityIconComponent } from './commodity-icons/electricity-icon/electricity-icon';
import { GasIconComponent } from './commodity-icons/gas-icon/gas-icon';
import { SearchIconComponent } from './search-icon/search-icon';
import { CancelIconComponent } from './cancel-icon/cancel-icon';
import { ComponentsQuestionIconComponent } from './components-question-icon/components-question-icon';
import { ComponentsAlertActionsComponent } from './components-alert-actions/components-alert-actions';

@NgModule({
	declarations: [
		ElectricityIconComponent,
		GasIconComponent,
    SearchIconComponent,
    CancelIconComponent,
    ComponentsQuestionIconComponent,
    ComponentsAlertActionsComponent
	],
	imports: [],
	exports: [
		ElectricityIconComponent,
		GasIconComponent,
    SearchIconComponent,
    CancelIconComponent,
    ComponentsQuestionIconComponent,
    ComponentsAlertActionsComponent
	]
})
export class ComponentsModule {}
