import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss'],
    animations: [routerTransition()]

})
export class EmployeesComponent implements OnInit {
    data: any;
    constructor(private http: HttpClient, private router: Router) {
    }

    ngOnInit() {

        this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe(response => {
            // Read the result field from the JSON response.
            this.data = response;
        });
    }

    settings = {
        columns: {
            userId: {
                title: 'Company Id'
            },
            id: {
                title: 'Employee Number'
            },
            title: {
                title: 'Title'
            },
            completed: {
                title: 'Completed'
            }
        },
        actions: {
            edit: false,
            add: false,
            delete: false,
            position: 'right'
        }
    };

    onSelectRow = function () {
        this.router.navigate(['employees/details'], { relativeTo: this.route });
    };
}
