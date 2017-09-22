import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { PageHeaderModule } from '../../shared';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        EmployeesRoutingModule,
        Ng2SmartTableModule,
        PageHeaderModule,
        HttpClientModule
    ],
    declarations: [EmployeesComponent]
})
export class EmployeesModule { }
