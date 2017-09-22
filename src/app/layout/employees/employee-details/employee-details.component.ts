import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-employee-details',
    templateUrl: './employee-details.component.html',
    styleUrls: ['./employee-details.component.scss'],
    animations: [routerTransition()]
})
export class EmployeeDetailsComponent implements OnInit {
    data: any;
    hero: string;
    model: boolean = true;
    constructor(private http: HttpClient) {
    }

    ngOnInit() {

    }
}
