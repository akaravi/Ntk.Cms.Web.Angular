import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketingComponent } from './ticketing.component';
import { TicketingDepartemenListComponent } from './departemen/list/list.component';
import { TicketingDepartemenEditComponent } from './departemen/edit/edit.component';
import { TicketingFaqListComponent } from './faq/list/list.component';
import { TicketingFaqEditComponent } from './faq/edit/edit.component';



const routes: Routes = [
  {
    path: '',
    component: TicketingComponent,
    children: [
      {
        path: 'departemen',
        component: TicketingDepartemenListComponent
      },
      {
        path: 'departemen/add/',
        component: TicketingDepartemenEditComponent
      },
      {
        path: 'departemen/edit/:Id',
        component: TicketingDepartemenEditComponent
      },
      {
        path:'faq',
        component:TicketingFaqListComponent
      },{
        path:'faq/add',
        component:TicketingFaqEditComponent
      }
      ,{
        path:'faq/edit/:id',
        component:TicketingFaqEditComponent
      }
      // {
      //   path: 'vote',
      //   component: TicketingVoteListComponent
      // },
      // {
      //   path: 'vote/:ContentId',
      //   component: TicketingVoteListComponent
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketingRouting {
}
