import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DashboardService } from 'app/layout/dashboard/dashboard.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    gauge: (container: any, configuration: any) => any;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor(private dashboardService: DashboardService) {

    }

    ngOnInit() {
        var gaugeOptions = {
            margin: { top: 80, left: 70 },
            clipWidth: 300,
            clipHeight: 300,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 20,
        };
        var gaugeOptions02 = {
            margin: { top: 80, left: 70 },
            clipWidth: 300,
            clipHeight: 300,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 80,
        };
        this.dashboardService.renderGaugeChart('#gauge', gaugeOptions, 'red');
        this.dashboardService.renderGaugeChart('#gauge02', gaugeOptions02, 'blue');
    }

    imageUploaded(event) {
        console.log(event);
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
