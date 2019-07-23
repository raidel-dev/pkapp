import { NgModule } from '@angular/core';
import { GasElectricityFilterPipe } from './gas-electricity-filter/gas-electricity-filter';
import { ContractNameFilterPipe } from './contract-name-filter/contract-name-filter';
import { AlertFilterPipe } from './alert-filter/alert-filter';
import { ContractsWithoutEntitiesFilterPipe } from './contracts-without-entities-filter/contracts-without-entities-filter';
import { FriendlyStatusPipe } from './friendly-status/friendly-status';
import { ContractNumFilterPipe } from './contract-num-filter/contract-num-filter';
import { HighlightTextPipe } from './highlight-text/highlight-text';
import { EntitiesWithInvoicesPipe } from './entities-with-invoices/entities-with-invoices';
import { ContractsWithInvoicesPipe } from './contracts-with-invoices/contracts-with-invoices';
import { LocationsWithInvoicePipe } from './locations-with-invoice/locations-with-invoice';
import { BestRatesPipe } from './best-rates/best-rates';
import { ConfirmedContractFilterPipe } from './confirmed-contract-filter/confirmed-contract-filter';
import { SortContractsByServiceTypePipe } from './sort-contracts-by-service-type/sort-contracts-by-service-type';
import { ContractsFilterPipe } from './contracts-filter/contracts-filter';
import { FormatPhonePipe } from './format-phone/format-phone';
import { OnlyPopularTermsPipe } from './only-popular-terms/only-popular-terms';
import { RateFilterPipe } from './rate-filter/rate-filter';

@NgModule({
	declarations: [
		GasElectricityFilterPipe,
		ContractNameFilterPipe,
    AlertFilterPipe,
    ContractsWithoutEntitiesFilterPipe,
    FriendlyStatusPipe,
    ContractNumFilterPipe,
    HighlightTextPipe,
    EntitiesWithInvoicesPipe,
    ContractsWithInvoicesPipe,
    LocationsWithInvoicePipe,
    BestRatesPipe,
    ConfirmedContractFilterPipe,
    SortContractsByServiceTypePipe,
    ContractsFilterPipe,
    FormatPhonePipe,
    OnlyPopularTermsPipe,
    RateFilterPipe
	],
	imports: [],
	exports: [
		GasElectricityFilterPipe,
		ContractNameFilterPipe,
    AlertFilterPipe,
    ContractsWithoutEntitiesFilterPipe,
    FriendlyStatusPipe,
    ContractNumFilterPipe,
    HighlightTextPipe,
    EntitiesWithInvoicesPipe,
    ContractsWithInvoicesPipe,
    LocationsWithInvoicePipe,
    BestRatesPipe,
    ConfirmedContractFilterPipe,
    SortContractsByServiceTypePipe,
    ContractsFilterPipe,
    FormatPhonePipe,
    OnlyPopularTermsPipe,
    RateFilterPipe
	]
})
export class PipesModule {}
