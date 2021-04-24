import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreModuleSaleHeaderGroupListComponent } from './header-group/list/list.component';
import { CoreModuleSaleHeaderListComponent } from './header/list/list.component';
import { CoreModuleSaleInvoiceDetailListComponent } from './invoice-detail/list/list.component';
import { CoreModuleSaleInvoiceListComponent } from './invoice/list/list.component';
import { CoreModuleSaleItemListComponent } from './Item/list/list.component';
import { CoreModuleSaleSerialListComponent } from './serial/list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'headergroup',
        component: CoreModuleSaleHeaderGroupListComponent
      },
      {
        path: 'header',
        component: CoreModuleSaleHeaderListComponent
      },
      {
        path: 'header/:LinkHeaderGroupId',
        component: CoreModuleSaleHeaderListComponent
      },
      {
        path: 'invoice',
        component: CoreModuleSaleInvoiceListComponent
      },
      {
        path: 'invoicedetail',
        component: CoreModuleSaleInvoiceDetailListComponent
      },
      {
        path: 'item',
        component: CoreModuleSaleItemListComponent
      },
      {
        path: 'item/LinkModuleSaleHeader/:LinkModuleSaleHeader',
        component: CoreModuleSaleItemListComponent
      },
      {
        path: 'serial',
        component: CoreModuleSaleSerialListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleSaleRouting {
}