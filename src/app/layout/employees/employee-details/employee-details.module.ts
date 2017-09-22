import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDetailsRoutingModule } from './employee-details-routing.module';
import { EmployeeDetailsComponent } from './employee-details.component';
import { PageHeaderModule } from '../../../shared';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        EmployeeDetailsRoutingModule,
        Ng2SmartTableModule,
        PageHeaderModule,
        HttpClientModule,
        FormsModule,
        NgbModule.forRoot()  
    ],
    declarations: [EmployeeDetailsComponent]
})
export class EmployeeDetailsModule { }
