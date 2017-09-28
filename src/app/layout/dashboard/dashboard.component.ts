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
    gaugeOptions02: { margin: { top: number; left: number; right: number; }; clipWidth: number; clipHeight: number; lowSector: string; midSector: string; highSector: string; value: number; };
    gaugeOptions: { margin: { top: number; left: number; right: number; }; clipWidth: number; clipHeight: number; lowSector: string; midSector: string; highSector: string; value: number; };
    gauge: (container: any, configuration: any) => any;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor(private dashboardService: DashboardService) {

    }

    ngOnInit() {
        this.gaugeOptions = {
            margin: { top: 0, left: 0 ,  right:0},
            clipWidth: 300,
            clipHeight: 160,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 20,
        };
        this.gaugeOptions02 = {
            margin: { top: 0, left: 0, right:0 },
            clipWidth: 300,
            clipHeight: 160,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 80,
        };
        this.dashboardService.renderGaugeChart('#gauge', this.gaugeOptions, 'red');
        this.dashboardService.renderGaugeChart('#gauge02', this.gaugeOptions02, 'blue');
        
    }

    imageUploaded(event) {
        console.log(event);
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
