import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesComponent } from './employees.component';

const routes: Routes = [
    { path: '', component: EmployeesComponent },
    { path: 'details', loadChildren: './employee-details/employee-details.module#EmployeeDetailsModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeesRoutingModule { }
